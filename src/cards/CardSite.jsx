import { GeneralContext } from "../App";
import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import { Avatar, Card, CardContent, CardHeader, CardMedia, Container, Grid, Typography } from '@mui/material';
import { red } from '@mui/material/colors';

export default function CardSite() {
    const { cardID } = useParams();
    const { setLoader } = useContext(GeneralContext)
    const [card, setCard] = useState({});

    useEffect(() => {
        setLoader(true);
        fetch(`https://api.shipap.co.il/cards/${cardID}?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setCard(data);
                setLoader(false);
            });

    }, []);

    return (

        <Container sx={{ py: 8 }} maxWidth="lg">
            {
                card &&
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Card sx={{ maxWidth: "100%" }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {card.userName ? card.userName[0] : ""}
                                    </Avatar>
                                }
                                title={card.userName}
                                subheader={card.createdTime}
                            />
                            <Typography variant='h3' mb={5} textAlign={'center'} color="text.main">{card.title}</Typography>
                            <CardMedia
                                component="img"
                                height="100%"
                                image={card.imgUrl}
                                alt={card.imgAlt}
                            />
                            <CardContent>
                                <Typography variant='h4' color="text.primary" mb={1}>Country: {card.country}</Typography>
                                <Typography variant='h4' color="text.primary" mb={1}>City: {card.city}</Typography>
                                <Typography variant='h4' color="text.primary" mb={1}>Street: {card.street}</Typography>
                                <Typography variant='h4' color="text.primary" mb={1}>House Number: {card.houseNumber}</Typography>
                                <Typography variant='h4' color="text.primary" mb={1}>Phone: {card.phone}</Typography>
                                <Typography variant='h4' color="text.primary" mb={1}>Email: {card.email}</Typography>
                                <Typography variant='h4' color="text.primary" mb={1}>Web: {card.web}</Typography>
                                <Typography variant="h3" color="text.primary" mb={1}>Description: {card.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>}
        </Container>

    )
}
