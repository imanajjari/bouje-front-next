import Logo from "./Logo";

// Luxury Loading Animation Component
export const LuxuryLoadingAnimation = ({iconColor = "#FFFFFF" }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 z-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/5 via-transparent to-white/10" />
        </div>
        
        {/* Main Loading Container */}
        <div className="relative flex flex-col items-center justify-center">

          
          {/* Logo with Luxury Animation */}
          <div className="relative z-10">
            <Logo   
              className={`transition-all duration-700 ease-out transform w-12 h-12 scale-75 opacity-80 hover:scale-110 hover:rotate-3`}
              fillColor={ iconColor} 
            />
            
            {/* Luxury Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
                 style={{ 
                   animation: 'shimmer 2s infinite',
                   backgroundSize: '200% 100%' 
                 }} />
          </div>
          
          {/* Elegant Typography */}
          <div className="mt-8 text-center">
            <div className="flex space-x-1 mb-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
            </div>
            
            <p className="text-base font-light text-gray-700 animate-fade-in">
  آغاز تجربه‌ای از ظرافت و شکوه
</p>
            
            {/* Luxury Progress Bar */}
            <div className="mt-4 w-32 h-px bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-black to-gray-400 animate-progress" 
                   style={{ 
                     animation: 'progress 2s infinite ease-in-out',
                     width: '40%' 
                   }} />
            </div>
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-gray-400 rounded-full animate-float opacity-30" 
               style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-gray-600 rounded-full animate-float opacity-40" 
               style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-black rounded-full animate-float opacity-50" 
               style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-gray-500 rounded-full animate-float opacity-35" 
               style={{ animationDelay: '1.5s' }} />
        </div>
        
        {/* Custom Styles */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(200%); }
            100% { transform: translateX(-100%); }
          }
          
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-10px) translateX(5px); }
            50% { transform: translateY(0px) translateX(10px); }
            75% { transform: translateY(5px) translateX(5px); }
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          
          .animate-progress {
            animation: progress 2s infinite ease-in-out;
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  };