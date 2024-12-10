import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Privacy() {
  return (
    <Page title="Privacy Policy">
      <Container>
        <ContentStyle sx={{ textAlign: 'left', alignItems: 'left' }}>
          <Typography variant="h1" paragraph>
            Gymshare Privacy Policy
          </Typography>
          <Typography variant="h3" paragraph>
            Polish
          </Typography>

          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
          Polityka Prywatności
          </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Właścicielem strony internetowej gymshare.pl jest firma Gymshare, która jest administratorem Twoich danych osobowych.
Niniejsza Polityka prywatności określa, w jaki sposób przetwarzamy informacje gromadzone na stronie gymshare.pl, a także wyjaśnia powody, 
dla których musimy gromadzić określone dane o użytkowniku. Dlatego przed rozpoczęciem korzystania ze strony gymshare.pl zapoznaj się z niniejszą 
Polityką Prywatności.
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Dbamy o Twoje dane osobowe i zobowiązujemy się do zapewnienia ich poufności i ochrony.
Gromadzone przez nas dane osobowe: imię, nazwisko, e-mail.
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Ponadto, możemy gromadzić dane osobowe, które nam przekażesz (w tym, między innymi, imię, nazwisko, adres e-mail itp.) 
na etapie rejestracji, aby umożliwić realizację umowy.
Dlaczego przetwarzamy Twoje dane?
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Możesz odwiedzić naszą Stronę internetową bez konieczności ujawniania nam swojej tożsamości lub przekazywania jakichkolwiek informacji, 
na podstawie których ktoś mógłby rozpoznać Cię jako konkretną, możliwą do zidentyfikowania osobę. Jeśli jednak zechcesz skorzystać z niektórych 
funkcji Strony, lub podać inne informacje poprzez wypełnienie formularza, możesz przekazać nam swoje 
dane osobowe, takie jak adres e-mail, imię, nazwisko, miasto w którym mieszkasz, firma, organizacja, numer telefonu. Możesz zrezygnować z podawania 
nam swoich danych osobowych, jednak wówczas możesz nie być w stanie korzystać z niektórych funkcji Strony. Na przykład, nie będziemy w stanie 
wysyłać Ci naszego Newslettera lub nawiązać z Tobą kontaktu bezpośrednio na Stronie. Użytkownicy, którzy nie są pewni, które informacje są 
obowiązkowe, mogą skontaktować się z nami pisząc na adres pomoc@gymshare.pl.
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Jeśli jesteś obywatelem Unii Europejskiej, przysługują Ci następujące prawa związane z Twoimi danymi osobowymi:
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
    Prawo do uzyskania informacji.
    </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
    Prawo dostępu do informacji.
    </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
    Prawo do korekty danych.
    </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
    Prawo do usunięcia danych.
    </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
    Prawo do ograniczenia przetwarzania danych.
    </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
    Prawo do zastrzeżenia sposobu przetwarzania danych.
    </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
    Prawo sprzeciwu.
    </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
    Prawa odnoszące się do automatyzacji podejmowania decyzji i profilowania.
    </Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Jeśli chcesz skorzystać z tego prawa, skontaktuj się z nami pisząc na adres pomoc@gymshare.pl.
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Ponadto, jeśli jesteś obywatelem Unii Europejskiej, zaznaczamy, że dane użytkownika mogą być przetwarzane w celu realizacji 
ewentualnych umów z nim zawartych lub w celu realizacji naszych 
uzasadnionych działań biznesowych wymienionych powyżej. Ponadto należy mieć na uwadze, że informacje o użytkowniku mogą być przekazywane 
poza granice Unii Europejskiej, w tym do Kanady i Stanów Zjednoczonych.
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Na naszej Stronie internetowej mogą znajdować się linki do innych witryn, które nie stanowią naszej własności ani nie są przez nas nadzorowane. 
Informujemy, że nie ponosimy odpowiedzialności za inne strony internetowe ani za ich praktyki związane z ochroną prywatności. Z tego powodu zachęcamy 
do świadomego opuszczenia naszej strony i zapoznania się z polityką prywatności każdej strony internetowej, która może gromadzić dane osobowe.
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Zapewniamy bezpieczeństwo informacji udostępnianych przez użytkownika na serwerach komputerowych w środowisku kontrolowanym, bezpiecznym, 
zabezpieczonym przed nieuprawnionym dostępem, wykorzystaniem lub ujawnieniem. W ramach kontroli i nadzoru stosujemy odpowiednie 
zabezpieczenia administracyjne, techniczne i fizyczne w celu ochrony przed nieuprawnionym dostępem, wykorzystaniem, modyfikacją i 
ujawnieniem danych osobowych. Nie możemy jednak zagwarantować bezpieczeństwa transmisji danych przez sieć internetową lub bezprzewodową.
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Wszelkie informacje, które gromadzimy, wykorzystujemy lub otrzymujemy, zostaną ujawnione, jeśli jest to wymagane lub zgodne z prawem, np. w celu 
wywiązania się z wezwania do sądu lub podobnego postępowania prawnego oraz wówczas, gdy w dobrej wierze uznamy, że ujawnienie jest koniecznie w celu 
ochrony naszych praw, Twojego bezpieczeństwa lub bezpieczeństwa innych osób, wykrycia oszustwa lub w odpowiedzi na wezwanie organów rządowych.
Informacje kontaktowe: pomoc@gymshare.pl.
</Typography>
          <Typography sx={{ color: 'text.secondary', margin: '0.5vh' }}>
Jeżeli chcesz się z nami skontaktować, aby uzyskać więcej informacji na temat niniejszej Polityki Prywatności lub w jakiejkolwiek sprawie mającej 
związek z Twoimi prawami i danymi osobowymi, możesz wysłać wiadomość e-mail na adres pomoc@gymshare.pl. 
          </Typography>
        </ContentStyle>
      </Container>
    </Page>
  );
}
