import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../App';
import Joi from 'joi';
import { useState } from 'react';
import { useContext } from 'react';

export const textFieldStructure = [
    { name: 'title', type: 'text', label: 'Title', block: false },
    { name: 'subtitle', type: 'text', label: 'Subtitle', block: false },
    { name: 'description', type: 'text', label: 'Description', block: true },
    { name: 'phone', type: 'tel', label: 'Phone', block: false },
    { name: 'email', type: 'email', label: 'Email', block: false },
    { name: 'web', type: 'text', label: 'Web', block: false },
    { name: 'imgUrl', type: 'text', label: 'Img Url', block: true },
    { name: 'imgAlt', type: 'text', label: 'Img Alt', block: false },
    { name: 'state', type: 'text', label: 'State', block: false },
    { name: 'country', type: 'text', label: 'Country', block: false },
    { name: 'city', type: 'text', label: 'City', block: false },
    { name: 'street', type: 'text', label: 'Street', block: false },
    { name: 'houseNumber', type: 'number', label: 'House Number', block: false },
    { name: 'zip', type: 'number', label: 'Zip', block: false },
];

export default function AddCard() {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        phone: '',
        email: '',
        web: '',
        imgUrl: '',
        imgAlt: '',
        state: '',
        country: '',
        city: '',
        street: '',
        houseNumber: '',
        zip: ''
    });

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();
    const { setLoader, mode, setOpen, setSnackbarMsg } = useContext(GeneralContext);
    const theme = createTheme({
        palette: {
            mode: mode,
        },
    });


    const handelChange = ev => {
        const { name, value } = ev.target;
        const obj = { ...formData, [name]: value };
        setFormData(obj);
        const schema = Joi.object({
            title: Joi.string().min(2).max(20).required(),
            description: Joi.string().min(2).max(100).required(),
            subtitle: Joi.string().min(2).max(20).required(),
            phone: Joi.string().min(10).max(15).required(),
            email: Joi.string().email({ tlds: false }).required(),
            web: Joi.string().min(2).max(100).required(),
            imgUrl: Joi.string().min(2).max(10000).required(),
            imgAlt: Joi.string().min(2).max(1000).required(),
            state: Joi.string().min(2).max(100).required(),
            country: Joi.string().min(2).max(100).required(),
            city: Joi.string().min(2).max(100).required(),
            street: Joi.string().min(2).max(100).required(),
            houseNumber: Joi.string().min(1).max(20).required(),
            zip: Joi.string().min(5).max(10).required(),
        });

        const validate = schema.validate(obj, { abortEarly: false });
        const tempErrors = { ...errors };
        delete tempErrors[name];

        if (validate.error) {
            const item = validate.error.details.find(e => e.context.key === name);

            if (item) {
                tempErrors[name] = item.message;
            }
        }

        setIsFormValid(!validate.error);
        setErrors(tempErrors);
    }

    const handleSubmit = ev => {
        ev.preventDefault();
        const obj = {};
        const elements = ev.target.elements;

        textFieldStructure.forEach(s => {
            if (s.type === 'boolean') {
                obj[s.name] = elements[s.name].checked;
            } else {
                obj[s.name] = elements[s.name].value;
            }
        });

        setLoader(true);

        fetch(`https://api.shipap.co.il/business/cards?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(obj),
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    return res.text().then(x => {
                        throw new Error(x);
                    });
                }
            })
            .then(() => {
                navigate('/my-cards');
                setOpen(true);
                setSnackbarMsg("The Card Added Successfully");
            })
            .catch(err => alert(err.message))
            .finally(() => setLoader(false));
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    </Avatar>
                    <Typography component="h1" variant="h5">Add New Card</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            {
                                textFieldStructure.map(t =>
                                    <Grid key={t.name} item xs={12} sm={t.block ? 12 : 6}>
                                        {
                                            <TextField
                                                error={Boolean(errors[t.name])}
                                                helperText={errors[t.name]}
                                                margin="normal"
                                                required
                                                fullWidth
                                                id={t.name}
                                                label={t.label}
                                                name={t.name}
                                                type={t.type}
                                                autoComplete={t.name}
                                                onChange={handelChange}

                                            />
                                        }
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!isFormValid}
                        >
                            Submit Your New Card
                        </Button>
                    </Box>
                </Box>
            </Container>
            <br /> <br /> <br /> <br />
        </ThemeProvider>
    );
}