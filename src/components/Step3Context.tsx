import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { HeaderBar } from './HeaderBar';
import { HintModal } from './HintModal';
import { PraisePopup } from './PraisePopup';
import { Step3Question } from '../types';
import { generateStep3Questions } from '../data/words';
import { sound } from '../utils/sound';
import { WORDIE_IMAGES } from '../assets/images';

interface Step3ContextProps {
  onComplete: () => void;
  onRecordWrong: (wordId: string) => void;
}

export const Step3Context: React.FC<Step3ContextProps> = ({
  onComplete,
  onRecordWrong,
}) => {
  const [questions] = useState<Step3Question[]>(() => generateStep3Questions());
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrectState, setIsCorrectState] = useState<boolean | null>(null);
  const [shakeOption, setShakeOption] = useState<string | null>(null);
  const [showGrowthFeedback, setShowGrowthFeedback] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (selectedOption !== null && isCorrectState === true) return;

    setSelectedOption(option);
    if (option === currentQ.correctOption) {
      // Correct!
      setIsCorrectState(true);
      sound.playCorrect();
      setShowGrowthFeedback(true);

      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setIsCorrectState(null);
          setShowGrowthFeedback(false);
        } else {
          // Finished all 10 questions
          onComplete();
        }
      }, 850);
    } else {
      // Incorrect!
      setIsCorrectState(false);
      sound.playWrong();
      setShakeOption(option);
      onRecordWrong(currentQ.targetWord.id);

      setTimeout(() => {
        setIsHintOpen(true);
        setShakeOption(null);
      }, 400);
    }
  };

  const handleCloseHint = () => {
    setIsHintOpen(false);
    setSelectedOption(null);
    setIsCorrectState(null);
  };

  // Render sentence with blank or filled word
  const renderSentence = () => {
    const parts = currentQ.sentence.split('______');
    return (
      <div className="text-xl sm:text-2xl font-black text-slate-800 text-center leading-relaxed tracking-wide font-['Fredoka']">
        <span>{parts[0]}</span>
        {isCorrectState === true ? (
          <span className="text-emerald-800 font-black underline decoration-emerald-500 decoration-3 mx-1 bg-emerald-100/90 px-3 py-1 rounded-xl shadow-xs">
            {currentQ.correctOption}
          </span>
        ) : (
          <span className="inline-block bg-amber-100 text-amber-900 border-2 border-dashed border-amber-400 px-3 py-0.5 rounded-xl min-w-[70px] text-center mx-1 font-sans text-sm font-extrabold shadow-2xs">
            ? 빈칸
          </span>
        )}
        <span>{parts[1]}</span>
      </div>
    );
  };

  return (
    <div
      id="step3-screen"
      className="w-full h-full flex flex-col justify-between max-w-md mx-auto py-2.5 px-4 select-none relative flex-1"
    >
      {/* Top bar & Guidance */}
      <div className="shrink-0">
        <HeaderBar
          stepText="STEP 3/3"
          rightText={`문제 ${currentIndex + 1}/10`}
          stageImage={WORDIE_IMAGES.stageChild}
        />

        {/* Guidance text */}
        <div className="text-center mt-2.5 mb-2 bg-sky-50/80 border border-sky-200/90 rounded-2xl py-2 px-3 shadow-2xs">
          <h2 className="text-sm sm:text-base font-extrabold text-sky-950">
            문맥에 알맞은 단어를 선택하세요.
          </h2>
        </div>
      </div>

      {/* Quiz Area: Sentence Card + Choices smoothly centered with uniform spacing */}
      <div className="w-full flex-1 flex flex-col justify-center items-center gap-3.5 sm:gap-5 my-auto">
        {/* Center Sentence card */}
        <motion.div
          key={`sentence-${currentQ.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full min-h-[110px] sm:min-h-[125px] bg-gradient-to-b from-slate-50 to-indigo-50/30 rounded-3xl flex flex-col items-center justify-center p-3.5 sm:p-4 shadow-xs relative border-3 border-slate-200 shrink-0"
        >
          {renderSentence()}
          <span className="text-[11px] sm:text-xs text-slate-600 mt-2 font-bold bg-white/90 px-3 py-0.5 rounded-full border border-slate-200">
            문맥에 알맞은 영어 단어를 골라보세요
          </span>
        </motion.div>

        {/* 6 Choices grid (2 columns x 3 rows) with consistent, natural uniform spacing */}
        <div className="w-full">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = isSelected && isCorrectState === true;
              const isShaking = shakeOption === opt;

              // 6 totally distinct, non-overlapping colors: Sky Blue, Rose Pink, Fresh Emerald, Vivid Orange, Warm Amber, Lavender Purple
              const colorThemes = [
                'bg-sky-50 text-sky-950 border-sky-200 border-b-sky-300 hover:bg-sky-100 hover:border-sky-400',
                'bg-rose-50 text-rose-950 border-rose-200 border-b-rose-300 hover:bg-rose-100 hover:border-rose-400',
                'bg-emerald-50 text-emerald-950 border-emerald-200 border-b-emerald-300 hover:bg-emerald-100 hover:border-emerald-400',
                'bg-orange-50 text-orange-950 border-orange-200 border-b-orange-300 hover:bg-orange-100 hover:border-orange-400',
                'bg-amber-50 text-amber-950 border-amber-200 border-b-amber-300 hover:bg-amber-100 hover:border-amber-400',
                'bg-purple-50 text-purple-950 border-purple-200 border-b-purple-300 hover:bg-purple-100 hover:border-purple-400',
              ];
              const theme = colorThemes[idx % colorThemes.length];

              return (
                <motion.button
                  key={opt}
                  type="button"
                  id={`choice-${opt}`}
                  onClick={() => {
                    sound.speak(opt);
                    handleSelect(opt);
                  }}
                  animate={isShaking ? { x: [-6, 6, -4, 4, 0] } : {}}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full min-h-[58px] sm:min-h-[66px] rounded-2xl flex items-center justify-center px-3 py-2 font-bold text-sm sm:text-base text-center transition-all cursor-pointer shadow-xs border-2 border-b-4 relative ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-500 border-b-emerald-600 font-extrabold ring-2 ring-emerald-300'
                      : isSelected && isCorrectState === false
                      ? 'bg-rose-100 text-rose-900 border-rose-400 border-b-rose-500'
                      : theme
                  }`}
                >
                  <span className="truncate font-['Fredoka']">{opt}</span>
                  {isCorrect && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Progress & Encouragement Note (anchors mobile and PC viewports) */}
      <div className="w-full mt-auto pt-1 pb-1 shrink-0">
        <div className="text-center py-2 text-xs text-sky-900 font-bold bg-sky-50/90 rounded-xl border border-sky-200/80 flex items-center justify-center gap-1.5">
          <span>✨ 문제 {currentIndex + 1} / {questions.length} • 문맥에 알맞은 영어 단어를 찾아보세요!</span>
        </div>
      </div>

      {/* Centered Praise Popup */}
      <PraisePopup
        isOpen={showGrowthFeedback}
        message="Wordie가 무럭무럭 자라나요! 🌿"
        image={WORDIE_IMAGES.stageChild}
      />

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintOpen}
        hint={currentQ.targetWord.hint}
        onClose={handleCloseHint}
      />
    </div>
  );
};

