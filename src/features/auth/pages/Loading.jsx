import { Atom } from "react-loading-indicators";

export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100%' 
    }}>
      <Atom 
        color="#ffffff" 
        size="large" 
        text="loading......" 
        textColor="whitesmoke" 
      />
    </div>
  );
}   