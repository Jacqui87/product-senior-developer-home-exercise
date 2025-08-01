import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NavBar from "./NavBar";
import { vi } from "vitest";

describe("NavBar component", () => {
  const fakeUser = {
    id: 123,
    firstName: "Jane",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    email: "jane.doe@example.com",
    department: 1,
    password: "secret123",
    role: 2,
    biography: "Software developer with 10 years experience.",
  };
  const initialState = {
    loggedInUser: fakeUser,
    people: [],
    selectedPerson: null,
    departments: [],
    roles: [],
    searchTerm: "",
    filterRole: 0,
    filterDepartment: 0,
    filteredPeople: [],
    errors: {},
    isAuthenticating: false,
    tokenInvalid: false,
  };

  let dispatchMock: ReturnType<typeof vi.fn>;
  let personServiceMock: {
    getAllPeople: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    dispatchMock = vi.fn();
    personServiceMock = {
      getAllPeople: vi.fn().mockResolvedValue([
        { id: 1, firstName: "Alice" },
        { id: 2, firstName: "Bob" },
      ]),
    };
  });

  it("renders the title", () => {
    render(
      <NavBar
        state={initialState}
        dispatch={dispatchMock}
        personService={personServiceMock as any}
      />
    );
    expect(screen.getByText("Person Manager")).toBeInTheDocument();
  });

  it("renders the logged-in user name", () => {
    render(
      <NavBar
        state={initialState}
        dispatch={dispatchMock}
        personService={personServiceMock as any}
      />
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("calls dispatch functions correctly on logout", async () => {
    render(
      <NavBar
        state={initialState}
        dispatch={dispatchMock}
        personService={personServiceMock as any}
      />
    );

    fireEvent.click(screen.getByText("Logout"));

    // Wait for async calls inside handleLogout
    await waitFor(() => {
      expect(personServiceMock.getAllPeople).toHaveBeenCalledWith(true);
    });

    // Check dispatch calls - order matters
    expect(dispatchMock).toHaveBeenNthCalledWith(1, {
      type: "SET_PEOPLE",
      payload: [
        { id: 1, firstName: "Alice" },
        { id: 2, firstName: "Bob" },
      ],
    });
    expect(dispatchMock).toHaveBeenNthCalledWith(2, { type: "LOGOUT" });
    expect(dispatchMock).toHaveBeenNthCalledWith(3, {
      type: "SET_AUTHENTICATING",
      payload: false,
    });
  });

  it("does not crash if loggedInUser is null", () => {
    render(
      <NavBar
        state={{ ...initialState, loggedInUser: null }}
        dispatch={dispatchMock}
        personService={personServiceMock as any}
      />
    );

    // Should render with no name displayed
    expect(screen.getByText("Person Manager")).toBeInTheDocument();
    // The Typography for user name would be empty, so no errors thrown
  });
});
