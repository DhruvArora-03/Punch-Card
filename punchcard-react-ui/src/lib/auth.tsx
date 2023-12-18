// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface User {
//   // Define the properties of your user object
//   username: string;
// }

// interface AuthContextProps {
//   user: User | null;
//   signIn: (userData: User) => void;
//   signOut: () => void;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   const signIn = (userData: User) => {
//     // Logic to sign in the user
//     setUser(userData);
//   };

//   const signOut = () => {
//     // Logic to sign out the user
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export { AuthProvider, useAuth };
