// // MyContext.tsx
// import React, { createContext, useState } from 'react';

// type MyContextType = {
//     data: number[];
//     addNumber: (newNumber: number) => void;
// };

// const MyContext = createContext<MyContextType | undefined>(undefined);

// export const MyProvider: React.FC = ({ children }) => {
//     const [data, setData] = useState<number[]>([]);

//     const addNumber = (newNumber: number) => {
//         setData([...data, newNumber]);
//     };

//     return (
//         <MyContext.Provider value={{ data, addNumber }}>
//             {children} {/* Aquí especificamos que children es parte del tipo */}
//         </MyContext.Provider>
//     );
// };

// export default MyContext;