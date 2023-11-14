import { Avatar, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { GeneralContext } from "../App";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { red } from '@mui/material/colors';


export default function FavCards() {
    const { user, setLoader, setOpen, setSnackbarMsg } = useContext(GeneralContext);
    const [favCards, setFavCards] = useState([])
    const [updateAllCards, setUpdateAllCards] = useState(undefined);
    const navigate = useNavigate();



    useEffect(() => {
        setLoader(true);
        fetch(`https://api.shipap.co.il/cards/favorite?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setFavCards(data)
                setLoader(false);
            });
    }, [updateAllCards]);

    const handleFavorite = (card) => {

        setLoader(true);
        fetch(`https://api.shipap.co.il/cards/${card.id}/unfavorite?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'PUT',
        })
            .then(() => {
                setUpdateAllCards(Math.random);
                setLoader(false);
                setOpen(true);
                setSnackbarMsg("Card removed from favorites")
            });

    }
    return (
        <>
            <Container sx={{ py: 8 }} maxWidth="md">
                <Grid container spacing={4}>
                    {
                        favCards.map(c =>
                            <Grid item key={c.id} xs={12} sm={6} md={4}>
                                <Card sx={{ maxWidth: 345, direction: "rtl" }}>
                                    <CardActionArea onClick={() => navigate(`/card-page/${c.id}`)}>
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                    {user ? user.fullName[0] : ""}
                                                </Avatar>
                                            }
                                            title={user ? user.fullName : ""}
                                            subheader={c.createdTime}
                                        />
                                        <CardMedia
                                            component="img"
                                            height="194"
                                            image={c.imgUrl}
                                            alt={c.imgAlt}
                                        />
                                        <CardContent>
                                            <Typography variant='h5' color="text.secondary">{c.subtitle}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {c.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions disableSpacing>

                                        <IconButton onClick={() => handleFavorite(c)} aria-label="remove from favorite">
                                            <FavoriteIcon sx={{ color: red[500] }} />
                                        </IconButton>
                                    </CardActions>

                                </Card>
                            </Grid>
                        )}
                </Grid>
            </Container>

        </>
    )
}
