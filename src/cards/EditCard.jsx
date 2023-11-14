import { ThemeProvider } from "@emotion/react";
import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography, createTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { textFieldStructure } from "./AddCard";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { GeneralContext } from "../App";
import Joi from "joi";

export default function EditCard() {
    const { setLoader, mode, setOpen, setSnackbarMsg } = useContext(GeneralContext);

    const theme = createTheme({
        palette: {
            mode: mode,
        },
    });
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

    const { cardID } = useParams();
    useEffect(() => {
        setLoader(true);
        fetch(`https://api.shipap.co.il/cards/${cardID}?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setLoader(false);
                setFormData(data);

            })
    }, [cardID]);

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
    const handelChange = ev => {
        const { name, value } = ev.target;
        const obj = { ...formData, [name]: value }
        setFormData(obj);

        const validate = schema.validate(obj, { abortEarly: false })
        const errors = {};
        if (validate.error) {
            validate.error.details.forEach(e => {
                const key = e.context.key;
                const err = e.message;

                errors[key] = err;
            })
        }
        setIsFormValid(!validate.error);
        setErrors(errors);
    }

    const handleSubmit = ev => {
        ev.preventDefault();
        setLoader(true);
        fetch(`https://api.shipap.co.il/business/cards/${cardID}?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(() => {
                setOpen(true);
                setSnackbarMsg("Card edited successfully")
                navigate('/my-cards')
                setLoader(false);
            });

    }


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
                        <ModeEditIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Edit Card</Typography>
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
                                                value={formData[t.name]}

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
                            disabled={isFormValid}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Container>
            <br /> <br /> <br /> <br />
        </ThemeProvider>
    );
}