// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface SidebarContextType {
//   isSidebarOpen: boolean;
//   toggleSidebar: () => void;
//   closeSidebar: () => void;
//   openSidebar: () => void;
// }

// const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// interface SidebarProviderProps {
//   children: ReactNode;
// }

// export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // Auto-hide sidebar on mobile view
//   useEffect(() => {
//     const handleResize = () => {
//       const isMobile = window.innerWidth <= 768;
      
//       if (isMobile) {
//         // Always close sidebar on mobile
//         setIsSidebarOpen(false);
//       } else {
//         // Open sidebar on desktop/tablet
//         setIsSidebarOpen(true);
//       }
//     };

//     // Check initial screen size
//     handleResize();

//     // Add event listener for window resize with debouncing
//     let resizeTimeout: NodeJS.Timeout;
//     const debouncedHandleResize = () => {
//       clearTimeout(resizeTimeout);
//       resizeTimeout = setTimeout(handleResize, 100);
//     };

//     window.addEventListener('resize', debouncedHandleResize);

//     // Cleanup event listener
//     return () => {
//       window.removeEventListener('resize', debouncedHandleResize);
//       clearTimeout(resizeTimeout);
//     };
//   }, []);

//   const toggleSidebar = () => {
//     console.log("Toggle bar clicked");
//     setIsSidebarOpen(prev => !prev);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   const openSidebar = () => {
//     setIsSidebarOpen(true);
//   };

//   const value: SidebarContextType = {
//     isSidebarOpen,
//     toggleSidebar,
//     closeSidebar,
//     openSidebar,
//   };

//   return (
//     <SidebarContext.Provider value={value}>
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// export const useSidebar = (): SidebarContextType => {
//   const context = useContext(SidebarContext);
//   if (context === undefined) {
//     throw new Error('useSidebar must be used within a SidebarProvider');
//   }
//   return context;
// };
