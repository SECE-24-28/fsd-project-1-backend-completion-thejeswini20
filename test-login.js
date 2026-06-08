const loginTest = async () => {
  try {
    console.log(
      "API URL:",
      `${process.env.REACT_APP_API_URL}/api/auth/login`
    );

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@dance.com",
          password: "admin123",
        }),
      }
    );

    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", text);

  } catch (error) {
    console.error("Login Error:", error);
  }
};

loginTest();
