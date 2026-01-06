// import React, { useState } from 'react';
// import { BiDonateHeart } from 'react-icons/bi';
// import { FaHandHoldingHeart, FaUserFriends } from 'react-icons/fa';

// const AuthPage = () => {
//   const [activeTab, setActiveTab] = useState('login');
//   const [userRole, setUserRole] = useState('donor');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const handleTabChange = (tab) => setActiveTab(tab);
//   const handleRoleChange = (role) => setUserRole(role);
//   const handleInputChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Replace this with your authentication logic
//     console.log('Tab:', activeTab, 'Role:', userRole, 'Data:', formData);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         {/* Tabs for Login/Signup */}
//         <div className="flex justify-center mb-6">
//           <button
//             onClick={() => handleTabChange('login')}
//             className={`px-4 py-2 font-semibold transition-colors duration-300 ${
//               activeTab === 'login'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600'
//             }`}
//           >
//             Login
//           </button>
//           <button
//             onClick={() => handleTabChange('signup')}
//             className={`px-4 py-2 font-semibold transition-colors duration-300 ${
//               activeTab === 'signup'
//                 ? 'text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600'
//             }`}
//           >
//             Sign Up
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {activeTab === 'signup' && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="Your Name"
//                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150"
//                 required
//               />
//             </div>
//           )}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="you@example.com"
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="********"
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-150"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
//           >
//             {activeTab === 'login' ? 'Login' : 'Sign Up'}
//           </button>
//         </form>

//         {/* Role Selection */}
//         <div className="mt-6">
//           <h3 className="text-center text-gray-600 mb-4">Select Your Role</h3>
//           <div className="flex justify-around">
//             {/* Donor */}
//             <div
//               onClick={() => handleRoleChange('donor')}
//               className={`flex flex-col items-center cursor-pointer p-4 rounded-lg transform transition duration-300 ${
//                 userRole === 'donor'
//                   ? 'bg-blue-100 scale-105'
//                   : 'hover:bg-gray-100'
//               }`}
//             >
//               <BiDonateHeart className="text-4xl text-blue-600 mb-2" />
//               <span className="text-sm font-medium">Donor</span>
//             </div>
//             {/* NGO */}
//             <div
//               onClick={() => handleRoleChange('ngo')}
//               className={`flex flex-col items-center cursor-pointer p-4 rounded-lg transform transition duration-300 ${
//                 userRole === 'ngo'
//                   ? 'bg-blue-100 scale-105'
//                   : 'hover:bg-gray-100'
//               }`}
//             >
//               <FaHandHoldingHeart className="text-4xl text-green-600 mb-2" />
//               <span className="text-sm font-medium">NGO</span>
//             </div>
//             {/* Volunteer */}
//             <div
//               onClick={() => handleRoleChange('volunteer')}
//               className={`flex flex-col items-center cursor-pointer p-4 rounded-lg transform transition duration-300 ${
//                 userRole === 'volunteer'
//                   ? 'bg-blue-100 scale-105'
//                   : 'hover:bg-gray-100'
//               }`}
//             >
//               <FaUserFriends className="text-4xl text-purple-600 mb-2" />
//               <span className="text-sm font-medium">Volunteer</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;

