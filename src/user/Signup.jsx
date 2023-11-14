import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../App';
import Joi from 'joi';
import { useState } from 'react';
import { useContext } from 'react';
import { Switch } from '@mui/material';



export const clientStructure = [
    { name: 'firstName', type: 'text', label: 'First Name', required: true, block: false },
    { name: 'middleName', type: 'text', label: 'Middle Name', required: false, block: false },
    { name: 'lastName', type: 'text', label: 'Last Name', required: true, block: false },
    { name: 'phone', type: 'tel', label: 'Phone', required: true, block: false },
    { name: 'email', type: 'email', label: 'Email', required: true, block: false },
    { name: 'password', type: 'password', label: 'Password', required: true, block: false, initialOnly: true },
    { name: 'imgUrl', type: 'text', label: 'Img Url', required: false, block: true },
    { name: 'imgAlt', type: 'text', label: 'Img Alt', required: false, block: false },
    { name: 'state', type: 'text', label: 'State', required: false, block: false },
    { name: 'country', type: 'text', label: 'Country', required: true, block: false },
    { name: 'city', type: 'text', label: 'City', required: true, block: false },
    { name: 'street', type: 'text', label: 'Street', required: true, block: false },
    { name: 'houseNumber', type: 'number', label: 'House Number', required: true, block: false },
    { name: 'zip', type: 'number', label: 'Zip', required: false, block: false },
    { name: 'business', type: 'boolean', label: 'Business', required: true, block: false },
];

export default function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    }); ///לנסות לשנות את זה לClientStructure

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
            firstName: Joi.string().required(),
            middleName: Joi.string(),
            lastName: Joi.string().required(),
            phone: Joi.number().required(),
            email: Joi.string().email({ tlds: false }).required(),
            password: Joi.string()
                .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@%$#^&*\-_*]).{8,32}$/)
                .required()
                .messages({
                    "string.pattern.base": "Password must meet the specified criteria",
                    "any.required": "Password is required",
                }),
            imgUrl: Joi.string(),
            imgAlt: Joi.string(),
            state: Joi.string(),
            country: Joi.string().required(),
            city: Joi.string().required(),
            street: Joi.string().required(),
            houseNumber: Joi.string().required(),
            zip: Joi.number(),


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

        clientStructure.forEach(s => {
            if (s.type === 'boolean') {
                obj[s.name] = elements[s.name].checked;
            } else {
                obj[s.name] = elements[s.name].value;
            }
        });

        setLoader(true);

        fetch(`https://api.shipap.co.il/clients/signup?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
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
            .then(() => navigate('/login'))
            .catch(err => alert(err.message))
            .finally(() => {
                setLoader(false);
                setOpen(true);
                setSnackbarMsg("User Created");
            });
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
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Register</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            {
                                clientStructure.map(s =>
                                    <Grid key={s.name} item xs={12} sm={s.block ? 12 : 6}>
                                        {
                                            s.type === 'boolean' ?
                                                <FormControlLabel
                                                    control={<Switch color="primary" name={s.name} />}
                                                    label={s.label}
                                                    labelPlacement="start"
                                                /> :
                                                <TextField
                                                    error={Boolean(errors[s.name])}
                                                    helperText={errors[s.name]}
                                                    margin="normal"
                                                    required={s.required}
                                                    fullWidth
                                                    id={s.name}
                                                    label={s.label}
                                                    name={s.name}
                                                    type={s.type}
                                                    autoComplete={s.name}
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
                            Signup
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link to="/login">
                                    Already have an account? Login
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <br /> <br /> <br /> <br />
        </ThemeProvider>
    );
}