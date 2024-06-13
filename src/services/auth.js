export function mockLogin(credentials, success = true) {
  if (!credentials.username || !credentials.password) {
    return {
      status: 404,
      response: {
        data: {
          message: "Invalid credentials",
          success: false,
          invalidCredentials: true,
        },
      },
    };
  }
  // This function is a mock function that simulates a login request
  const usersJSON = JSON.parse(localStorage.getItem("users")).registered || [];
  let credentialsAreValid = false;
  if (usersJSON.length === 0) {
    success = false;
  }
  const user = usersJSON.find(
    (u) =>
      u.username === credentials.username && u.password === credentials.password
  );

  if (user) {
    credentialsAreValid = true;
    success = true;
  }
  if (!success) {
    throw {
      status: 409,
      response: {
        data: { message: "A user is already logged in", success: false },
      },
    };
  }
  if (!credentialsAreValid) {
    // If the credentials are invalid
    return {
      status: 404,
      response: {
        data: {
          message: "Invalid credentials",
          success: false,
          invalidCredentials: true,
        },
      },
    };
  }
  return {
    // If the credentials are valid
    status: 200,
    response: {
      data: {
        message: "login succeeded",
        success: true,
        invalidCredentials: false,
      },
    },
  };
}

function getUsers() {
  const usersJSON = localStorage.getItem("users");
  return usersJSON ? JSON.parse(usersJSON).registered : [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify({ registered: users }));
}

export function mockGetUser(username) {
  const users = getUsers();
  const user = users.find((user) => user.username === username);
  console.log("mockGetUser", user);
  return {
    status: user ? 200 : 404,
    response: {
      data: user.username || { message: "User not found", success: false },
    },
  };
}

export function mockRegister(userDetails, success = true) {
  const users = getUsers();

  // Check if user already exists
  if (users.some((user) => user.username === userDetails.username)) {
    success = false;
  } else {
    users.push(userDetails);
    saveUsers(users);
  }

  if (!success) {
    throw {
      status: 409,
      response: { data: { message: "Username taken", success: false } },
    };
  }

  return {
    status: 200,
    response: { data: { message: "user created", success: true } },
  };
}

export function mockLogout() {
  return {
    status: 200,
    response: { data: { message: "logout succeeded", success: true } },
  };
}
