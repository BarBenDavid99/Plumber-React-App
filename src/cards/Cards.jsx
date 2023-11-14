import { Avatar, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { GeneralContext } from "../App";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { red } from '@mui/material/colors';
import { RoleTypes, checkPermissions } from '../components/Navbar';


export default function Cards() {

    const { user, setLoader, setOpen, setSnackbarMsg, userRoleType } = useContext(GeneralContext);
    const [allCards, setAllCards] = useState([])
    const [updateAllCards, setUpdateAllCards] = useState(undefined);

    const navigate = useNavigate();
    const crud = [
        {
            ariaLabel: 'delete',
            onClick: (id) => deleteCard(id),
            icon: <DeleteIcon />,
            permissions: [RoleTypes.admin],
        },
        {
            ariaLabel: 'favorite',
            onClick: (id) => handleFavorite(id),

            icon: <FavoriteIcon />,
            permissions: [RoleTypes.business, RoleTypes.admin],
        },
    ];
    const handleFavorite = (card) => {
        if (card.favorite === true) {
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
        } else {
            setLoader(true);
            fetch(`https://api.shipap.co.il/cards/${card.id}/favorite?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
                credentials: 'include',
                method: 'PUT',
            })
                .then(() => {
                    setUpdateAllCards(Math.random);
                    setLoader(false);
                    setOpen(true);
                    setSnackbarMsg("Card added to favorites")
                });
        }
    }

    const deleteCard = (item) => {
        setLoader(true);
        fetch(`https://api.shipap.co.il/admin/cards/${item.id}?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'DELETE',
        })
            .then(() => {
                setAllCards((prevCards) => prevCards.filter((card) => card.id !== item.id));

            })
            .finally(() => {
                setLoader(false);
                setOpen(true);
                setSnackbarMsg("Card deleted successfully")
            });
    }

    useEffect(() => {
        fetch(`https://api.shipap.co.il/cards?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setAllCards(data)
            });
    }, [updateAllCards]);

    return (
        <>
            <Container sx={{ py: 8 }} maxWidth="md">
                <Grid container spacing={4}>
                    {
                        allCards.map(c =>
                            <Grid item key={c.id} xs={12} sm={6} md={4}>
                                <Card sx={{ maxWidth: 345, direction: "rtl" }} >
                                    <CardActionArea onClick={() => navigate(`/card-page/${c.id}`)}>
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                    {c.userName[0]}
                                                </Avatar>
                                            }
                                            title={c.title}
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
                                        {
                                            crud.map((item) => (
                                                (!item.permissions || checkPermissions(item.permissions, userRoleType)) && (
                                                    <IconButton
                                                        key={item.ariaLabel}
                                                        aria-label={item.ariaLabel}
                                                        onClick={() => item.onClick(c)}
                                                    >
                                                        {item.icon}

                                                    </IconButton>
                                                )
                                            ))
                                        }
                                    </CardActions>

                                </Card>
                            </Grid>
                        )}
                </Grid>
            </Container>

        </>
    )
}
