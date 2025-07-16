import React, { useState } from 'react';
import { Play, CheckCircle, Clock, Lock } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  embedUrl: string;
}

const onboardingVideos: Video[] = [
  {
    id: '1',
    title: 'Bem-vindo à Teacher Poli',
    description: 'Conheça a plataforma e como ela pode transformar seu aprendizado',
    duration: '2:02',
    completed: true,
    locked: false,
    embedUrl: 'https://www.youtube.com/embed/mttHTuEK5Xs'
  },
  {
    id: '2',
    title: 'Nossa Cultura e Valores',
    description: 'Conheça tudo aquilo que nos guia',
    duration: '3:33',
    completed: true,
    locked: false,
    embedUrl: 'https://www.youtube.com/embed/-6J-tNXZkQc'
  },
  {
    id: '3',
    title: 'Passo a Passo: Primeiro Acesso',
    description: 'Como encontrar tudo que precisa para acessar pela primeira vez',
    duration: '00:57',
    completed: false,
    locked: false,
    embedUrl: 'https://www.youtube.com/embed/povotikiPeg'
  },
];

export default function OnboardingSection() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(onboardingVideos[0]);
  const [showPlayer, setShowPlayer] = useState(false);

  const handleVideoSelect = (video: Video) => {
    if (!video.locked) {
      setSelectedVideo(video);
      setShowPlayer(true);
    }
  };

  const markAsCompleted = (videoId: string) => {
    // In a real app, this would update the backend
    console.log(`Marking video ${videoId} as completed`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Comece por Aqui</h2>
        <p className="text-sm sm:text-base text-gray-600">Dê os primeiros passos na sua jornada de aprendizado com a Teacher Poli</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Video List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Lista de Vídeos</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {onboardingVideos.map((video) => (
                <div
                  key={video.id}
                  className={`p-3 sm:p-4 cursor-pointer transition-colors ${
                    video.locked 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50'
                  } ${
                    selectedVideo?.id === video.id ? 'bg-purple-50 border-r-4 border-purple-500' : ''
                  }`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {video.locked ? (
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      ) : video.completed ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                      ) : (
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {video.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {video.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {selectedVideo && showPlayer ? (
              <div>
                <div className="aspect-video">
                  <iframe
                    src={selectedVideo.embedUrl}
                    title={selectedVideo.title}
                    className="w-full h-full rounded-t-lg"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        {selectedVideo.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4">
                        {selectedVideo.description}
                      </p>
                    </div>
                    {!selectedVideo.completed && (
                      <button
                        onClick={() => markAsCompleted(selectedVideo.id)}
                        className="bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Marcar como Concluído</span>
                        <span className="sm:hidden">Concluído</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Selecione um vídeo para começar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
