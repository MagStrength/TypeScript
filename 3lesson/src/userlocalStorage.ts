// export class User {
//   userName: string;
//   avatarUrl: string;

//   constructor(userName: string, avatarUrl: string) {
//     this.userName = userName;
//     this.avatarUrl = avatarUrl;
//   }
// }

// const user = new User("Wade Warren", "./img/avatar.png");

// localStorage.setItem("user", JSON.stringify(user));
// localStorage.setItem("favoritesAmount", "2");

// export const getUserData = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   if ("userName" in user && 'avatarUrl' in user) {
//     return user;
//   }
// };

// export const getFavoritesAmount = () => {
//   const favoritesAmount = JSON.parse(localStorage.getItem("favoritesAmount"));

//   return favoritesAmount;
// };
