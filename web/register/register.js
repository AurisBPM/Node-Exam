const form = document.querySelector('form');
const info = document.getElementById('info');

const registerUser = async (payload) => {
  try {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat-password').value;

    const payload = {
      full_name: fullName,
      password: password,
      email: email,
    };

    if (password == repeatPassword) {
      const userData = await registerUser(payload);

      if (userData.error == 'Duplicate entry') {
        info.textContent = 'Email already exists';
        return;
      }
      if (userData.token) {
        Cookies.set('token', userData.token, { expires: 0.1 });
        window.location.replace('../groups/groups.html');
      }
    } else {
      info.textContent = 'The password did not match';
    }
  });
}
