var extend = require('extend-shallow');
const axios = require('axios').default;
import { Email, Password } from '../utils/validate-data.js';
import { CreateTopAlert } from '../utils/top-alert.js';
import { CreateUserFile, OpenUserFile } from '../class/__file_user.js';
import { UserData } from '../utils/connection-manager.js';
import { LoginClose, IndexOpen } from '../utils/window-manager.js';

const authFormLogin = document.getElementById('AuthLogin');

const MessageLabel = (options) => {
  options = extend(
    {
      element: '',
      label: '',
      message: '',
      remove: 'input',
      remove_2: '',
      add: 'is-invalid',
    },
    options,
  );
  options.element.classList.remove(options.remove);
  if (options.remove_2) options.element.classList.remove(options.remove_2);
  options.element.classList.add(options.add);
  options.label.innerHTML = options.message;
};

$(document).on('input', '#UserEmail', () => {
  const userEmail = document.getElementById('UserEmail');
  if (userEmail.value) {
    MessageLabel({
      element: userEmail,
      label: document.getElementById('UserEmailLabel'),
      remove: 'is-invalid',
      remove_2: 'input',
      add: 'is-valid',
    });
  } else
    MessageLabel({
      element: userEmail,
      label: document.getElementById('UserEmailLabel'),
      remove: 'is-valid',
      add: 'input',
    });
});

$(document).on('input', '#UserPassword', () => {
  const userPassword = document.getElementById('UserPassword');
  if (userPassword.value) {
    MessageLabel({
      element: userPassword,
      label: document.getElementById('UserPasswordLabel'),
      remove: 'is-invalid',
      remove_2: 'input',
      add: 'is-valid',
    });
  } else
    MessageLabel({
      element: userPassword,
      label: document.getElementById('UserPasswordLabel'),
      remove: 'is-valid',
      add: 'input',
    });
});

$('#UserRememberCredential').on('change', function () {
  if ($(this).is(':checked')) {
    $(this).attr('value', 'true');
    $('.messageWarningLogin')
      .removeClass('text-secondary')
      .addClass('text-warning');
  } else {
    $(this).attr('value', 'false');
    $('.messageWarningLogin')
      .removeClass('text-warning')
      .addClass('text-secondary');
  }
});

authFormLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const userEmail = document.getElementById('UserEmail');
  const userEmailValue = userEmail.value;
  const userEmailLabel = document.getElementById('UserEmailLabel');
  const userPassword = document.getElementById('UserPassword');
  const userPasswordValue = userPassword.value;
  const userPasswordLabel = document.getElementById('UserPasswordLabel');
  if (userEmailValue && userPasswordValue) {
    const email = Email(userEmailValue);
    const pass = Password({ pass: userPasswordValue });
    if (email && pass) {
      axios
        .post(process.env.AUTH_URL, {
          email: userEmailValue,
          password: userPasswordValue,
          device_name: 'sBotics',
        })
        .then(function (response) {
          const access_token = response['data']['access_token'];
          UserData({
            accessToken: access_token,
          })
            .then((response) => {
              if (
                !CreateUserFile({
                  data: {
                    name: 'julio cesar vera neto',
                    email: response['email'],
                    profilePicture: response['profile_photo_url'],
                    locale: response['locale'],
                    accessToken: access_token,
                    logged: false,
                  },
                })
              ) {
                CreateTopAlert({
                  states: 'danger',
                  idInner: 'TopAlertError',
                  absolute: true,
                  message:
                    'Uma falha inesperada aconteceu! Tente novamente mais tarde.',
                });
                MessageLabel({ element: userEmail, label: userEmailLabel });
                MessageLabel({
                  element: userPassword,
                  label: userPasswordLabel,
                });
                return;
              }

              LoginClose();
              IndexOpen();
            })
            .catch((err) => {
              CreateTopAlert({
                states: 'danger',
                idInner: 'TopAlertError',
                absolute: true,
                message:
                  'Uma falha inesperada ao localizar dados! Tente novamente mais tarde.',
              });
              MessageLabel({ element: userEmail, label: userEmailLabel });
              MessageLabel({ element: userPassword, label: userPasswordLabel });
            });
        })
        .catch(function (error) {
          console.log(error);
          CreateTopAlert({
            states: 'danger',
            idInner: 'TopAlertError',
            absolute: true,
            message:
              'Essas credenciais não foram encontradas em nossos registros.',
          });
          MessageLabel({ element: userEmail, label: userEmailLabel });
          MessageLabel({ element: userPassword, label: userPasswordLabel });
        });
    } else {
      if (!email)
        MessageLabel({
          element: userEmail,
          label: userEmailLabel,
          message: 'Digite um email valido.',
        });
      if (!pass)
        MessageLabel({
          element: userPassword,
          label: userPasswordLabel,
          message: 'A senha deve ter pelo menos 8 caracteres.',
        });
    }
  } else {
    if (!userEmailValue)
      MessageLabel({
        element: userEmail,
        label: userEmailLabel,
        message: 'Digite um email.',
      });
    if (!userPasswordValue)
      MessageLabel({
        element: userPassword,
        label: userPasswordLabel,
        message: 'Digite uma senha.',
      });
  }
});
