//how to create log in page in react js? 
//     fetch(this.email.value, this.password.value)
//     .then(res => {
//         localStorage.setItem('id_token', res.token) // Store token 
//     })
//     .catch(err => {
//         console.log(err);
//     });


//     class AuthService{
//         login(email, password) {
//             return this.fetch('/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     email, 
//                     password
//                 })
//             })
//               .then(res => {
//                 if(res.type == 'success'){
//                     this.setToken(res.token) // Setting the token in localStorage
//                     return Promise.resolve(res); 
//                 } else {
//                     return Promise.reject(res)
//                 }
//             })
//         }


//   // Other available methods
//        setToken(idToken) {
//         // Saves user token to localStorage
//         localStorage.setItem('id_token', idToken)
//        }

//       getProfile() {
//         // Using jwt-decode npm package to decode the token
//         return decode(localStorage.getItem('id_token') ;// assuming you have jwt token then use jwt-decode library
//       }
// //     }


// import AuthUtility from './utils/AuthUtility';

// login = (e) => {


//     this.Auth.login(this.email.value, this.password.value)
//     .then(res => {
//         this.props.history.push('/protectedRoute');
//     })
//     .catch(err => {
//         console.log(error);
//     });
// }




//Source: https://stackoverflow.com/questions/50231142




import React from 'react'

const Login = () => {
  return (
    <div>Login
    <div>
        <input>Email </input> 
        <input>password </input> 

    </div>

    </div>

  )
}

export default Login