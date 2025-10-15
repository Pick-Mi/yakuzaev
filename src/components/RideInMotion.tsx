import { ArrowRight, Play } from "lucide-react";
import { useState } from "react";

interface Video {
  thumbnail?: string;
  url?: string;
  title?: string;
}

interface RideInMotionProps {
  videos?: Video[];
}

const RideInMotion = ({ videos = [] }: RideInMotionProps) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handleVideoClick = (videoUrl?: string) => {
    if (videoUrl) {
      setPlayingVideo(videoUrl);
    }
  };

  const handleCloseVideo = () => {
    setPlayingVideo(null);
  };

  const firstVideo = videos[0];
  const secondVideo = videos[1];
  const thirdVideo = videos[2];

  return (
    <section className="bg-white w-full py-16 px-4 md:px-[70px]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-inter font-medium text-[48px] text-[#000000]">
            Ride in Motion
          </h2>
          <button className="hover:translate-x-1 transition-transform">
            <ArrowRight className="w-8 h-8 text-[#000000]" />
          </button>
        </div>

        {/* Video Grid - Desktop */}
        <div className="hidden md:flex gap-6 overflow-x-auto">
          {/* Large Video Card */}
          <div 
            className="relative w-[60%] min-w-[500px] h-[440px] bg-[#0a0a0a] overflow-hidden cursor-pointer group"
            onClick={() => handleVideoClick(firstVideo?.url)}
            style={{
              backgroundImage: firstVideo?.thumbnail ? `url(${firstVideo.thumbnail})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-black ml-1" fill="black" />
              </div>
            </div>
          </div>

          {/* Small Video Cards Container */}
          <div className="flex gap-6 w-[40%] min-w-[300px]">
            {/* Small Video Card 1 */}
            <div 
              className="relative flex-1 h-[440px] bg-[#888888] overflow-hidden cursor-pointer group"
              onClick={() => handleVideoClick(secondVideo?.url)}
              style={{
                backgroundImage: secondVideo?.thumbnail ? `url(${secondVideo.thumbnail})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
                </div>
              </div>
            </div>

            {/* Small Video Card 2 */}
            <div 
              className="relative flex-1 h-[440px] bg-[#888888] overflow-hidden cursor-pointer group"
              onClick={() => handleVideoClick(thirdVideo?.url)}
              style={{
                backgroundImage: thirdVideo?.thumbnail ? `url(${thirdVideo.thumbnail})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid - Mobile (Equal Width Cards) */}
        <div className="md:hidden flex flex-col gap-5">
          {/* Video Card 1 */}
          <div 
            className="relative w-full h-[300px] bg-[#0a0a0a] overflow-hidden cursor-pointer group"
            onClick={() => handleVideoClick(firstVideo?.url)}
            style={{
              backgroundImage: firstVideo?.thumbnail ? `url(${firstVideo.thumbnail})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
              </div>
            </div>
          </div>

          {/* Video Card 2 */}
          <div 
            className="relative w-full h-[300px] bg-[#888888] overflow-hidden cursor-pointer group"
            onClick={() => handleVideoClick(secondVideo?.url)}
            style={{
              backgroundImage: secondVideo?.thumbnail ? `url(${secondVideo.thumbnail})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
              </div>
            </div>
          </div>

          {/* Video Card 3 */}
          <div 
            className="relative w-full h-[300px] bg-[#888888] overflow-hidden cursor-pointer group"
            onClick={() => handleVideoClick(thirdVideo?.url)}
            style={{
              backgroundImage: thirdVideo?.thumbnail ? `url(${thirdVideo.thumbnail})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-black ml-0.5" fill="black" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {playingVideo && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={handleCloseVideo}
          >
            <div className="relative w-full max-w-5xl aspect-video">
              <button 
                className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300"
                onClick={handleCloseVideo}
              >
                ×
              </button>
              <video 
                src={playingVideo} 
                controls 
                autoPlay 
                className="w-full h-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RideInMotion;
