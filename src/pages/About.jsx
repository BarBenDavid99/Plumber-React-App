import { Typography } from '@mui/material';
import "./About.css";
export default function About() {
    return (
        <>
            <Typography variant='h3' mb={5} textAlign={'center'} color="text.main">About</Typography>
            <div className='container' >
                <Typography variant='h4' color="text.primary" mb={1} padding={'5px'} >Welcome to Plumber Cards App <br /> <br /> About this app</Typography>
                <Typography variant='h5' color="text.secondary" mb={1} padding={'5px'}>This App is a dynamic web In this application you can see cards of plumbers and get their full details including work areas and specializations. <br /> <br />
                    If you register on the site, you can also save cards of plumbers you like by marking that card as a favorite and all the cards will be displayed in the favorites tab,
                    You can edit your user information at any time you <br /><br />
                    If you register as a business user in the application, you will also be able to publish your own cards, edit it and delete it if necessary. Of course the cards you added will appear in the 'My Cards' tab.
                    In the application, you can change the screen display to 'Dark Mode' by clicking on the dark mode marker that appears in the upper Navbar. <br /><br />
                    Please note that the admin of the application has access to all the cards, so he can delete a card if the card is incorrect / inappropriate.
                </Typography>
                <Typography variant='h4' color="text.primary" mb={1} padding={'5px'} > About me </Typography>
                <Typography variant='h5' color="text.secondary" mb={1} padding={'5px'}> I am Bar Ben David, the creator of this application. I did my best to make the interface in the application as convenient as possible for both the business user and the regular user. <br /> <br />
                    To build this application I used React language while using Rest API and MUI technologies. <br /> <br />

                    If you encountered problems, or if you have improvement comments, I would appreciate it if you could send me an email to this email - "Barbendavid12@gmail.com". <br /> <br />

                    enjoy.
                </Typography>
            </div>
        </>
    )
}
