import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, Stack, Typography } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GeneralContext } from "../App";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { red } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import { RoleTypes, checkPermissions } from '../components/Navbar';

export default function MyCards() {
    const crud = [
        {
            ariaLabel: 'delete',
            onClick: (id) => deleteCard(id),
            icon: <DeleteIcon />,
            permissions: [RoleTypes.business, RoleTypes.admin],
        },
        {
            ariaLabel: 'edit',
            onClick: (id) => editCard(id),
            icon: <ModeEditIcon />,
            permissions: [RoleTypes.business, RoleTypes.admin],
        },
    ];
    const { userRoleType, setLoader, setOpen, setSnackbarMsg } = useContext(GeneralContext)
    const [myCards, setMyCards] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://api.shipap.co.il/business/cards?token=235796e8-56e7-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                setMyCards(data)
            });
    }, []);
    const editCard = (item) => {
        navigate(`/edit-card/${item.id}`);
    }
    const deleteCard = (item) => {
        setLoader(true);
        fetch(`https://api.shipap.co.il/business/cards/${item.id}?token=47d94128-56e0-11ee-aae9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'DELETE',
        })
            .then(() => {
                setMyCards((prevCards) => prevCards.filter((card) => card.id !== item.id));

            })
            .finally(() => {
                setLoader(false);
                setOpen(true);
                setSnackbarMsg("Card deleted successfully")
            });
    }

    return (
        <>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} position='fixed' top={"100px"} right={"50px"} >
                <Button onClick={() => navigate("/add-card")} variant="contained" endIcon={<AddIcon />}>
                    Add Card
                </Button>
            </Stack>
            <Container sx={{ py: 8 }} maxWidth="md">

                <Grid container spacing={4}>
                    {
                        myCards.map(c =>
                            <Grid item key={c.id} xs={12} sm={6} md={4}>
                                <Card Card sx={{ maxWidth: 345, direction: "rtl" }}>
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
