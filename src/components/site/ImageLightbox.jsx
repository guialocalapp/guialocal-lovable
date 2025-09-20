import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ChevronLeft, ChevronRight, X } from 'lucide-react';
    import { FocusOn } from 'react-focus-on';
    import { Button } from '@/components/ui/button';

    const ImageLightbox = ({ images, startIndex, onClose }) => {
        const [currentIndex, setCurrentIndex] = useState(startIndex);

        useEffect(() => {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, []);

        const showNextImage = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        };

        const showPrevImage = () => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        };

        const backdropVariants = {
            visible: { opacity: 1 },
            hidden: { opacity: 0 },
        };

        const imageVariants = {
            enter: (direction) => ({
                x: direction > 0 ? '100%' : '-100%',
                opacity: 0,
            }),
            center: {
                x: 0,
                opacity: 1,
            },
            exit: (direction) => ({
                x: direction < 0 ? '100%' : '-100%',
                opacity: 0,
            }),
        };

        const [direction, setDirection] = useState(0);

        const handleNext = () => {
            setDirection(1);
            showNextImage();
        };

        const handlePrev = () => {
            setDirection(-1);
            showPrevImage();
        };

        if (!images || images.length === 0) {
            return null;
        }

        return (
            <FocusOn onEscapeKey={onClose} onClickOutside={onClose}>
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.3 }}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10 hover:text-white z-10"
                            onClick={onClose}
                            aria-label="Fechar galeria"
                        >
                            <X className="w-8 h-8" />
                        </Button>

                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white z-10 h-14 w-14"
                                    onClick={handlePrev}
                                    aria-label="Imagem anterior"
                                >
                                    <ChevronLeft className="w-10 h-10" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white z-10 h-14 w-14"
                                    onClick={handleNext}
                                    aria-label="Próxima imagem"
                                >
                                    <ChevronRight className="w-10 h-10" />
                                </Button>
                            </>
                        )}

                        <AnimatePresence initial={false} custom={direction}>
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt={`Imagem ${currentIndex + 1}`}
                                className="max-w-[90vw] max-h-[90vh] object-contain"
                                custom={direction}
                                variants={imageVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: 'spring', stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = Math.abs(offset.x);
                                    if (swipe > 100) {
                                        if (offset.x < 0) {
                                            handleNext();
                                        } else {
                                            handlePrev();
                                        }
                                    }
                                }}
                            />
                        </AnimatePresence>
                         <div className="absolute bottom-4 text-white text-lg bg-black/50 px-4 py-2 rounded-full">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </motion.div>
            </FocusOn>
        );
    };

    export default ImageLightbox;