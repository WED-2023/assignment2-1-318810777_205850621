// src/services/auth.js
export function mockLogin(credentials) {
  let success = true;
  // Check if a user is already logged in
  const loggedInUser = localStorage.getItem("username");
  if (loggedInUser) {
    return {
      status: 409,
      response: {
        data: {
          message: "A user is already logged in",
          success: false,
        },
      },
    };
  }

  if (!credentials.username || !credentials.password) {
    return {
      status: 404,
      response: {
        data: {
          message: "Invalid credentials. check your data and try again.",
          success: false,
          invalidCredentials: true,
        },
      },
    };
  }

  const usersJSON = JSON.parse(localStorage.getItem("users")) || {
    registered: [],
  };
  const users = usersJSON.registered;
  let credentialsAreValid = false;

  if (users.length === 0) {
    success = false;
  }

  const user = users.find(
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
        data: {
          message: "A user is already logged in",
          success: false,
        },
      },
    };
  }

  if (!credentialsAreValid) {
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

  // Set the logged-in user in localStorage
  // localStorage.setItem("username", JSON.stringify(user));

  return {
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
  return {
    status: user ? 200 : 404,
    response: {
      data: user
        ? user.username
        : { message: "User not found", success: false },
    },
  };
}

export function mockRegister(userDetails, success = true) {
  const users = getUsers();

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
  localStorage.removeItem("username");
  return {
    status: 200,
    response: { data: { message: "logout succeeded", success: true } },
  };
}
