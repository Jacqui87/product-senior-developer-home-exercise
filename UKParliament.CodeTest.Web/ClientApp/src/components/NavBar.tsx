import { PersonService } from "../services/personService";
import { MainPageState, MainPageAction } from "../state/mainPageReducer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const NavBar = ({
  state,
  dispatch,
  personService,
}: {
  state: MainPageState;
  dispatch: React.Dispatch<MainPageAction>;
  personService: PersonService;
}) => {
  const handleLogout = async () => {
    const all = await personService.getAllPeople(true);
    dispatch({ type: "SET_PEOPLE", payload: all });

    dispatch({ type: "LOGOUT" });
    dispatch({ type: "SET_AUTHENTICATING", payload: false });
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Person Manager
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">
            {state.loggedInUser?.firstName} {state.loggedInUser?.lastName}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
