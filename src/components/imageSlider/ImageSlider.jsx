import React, { useEffect, useState, useRef } from 'react';
import "./imageSlider.scss";

const MAX_IMAGE_WIDTH = 600;

export const ImageSlider = ({ slides }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [width, setWidth] = useState(MAX_IMAGE_WIDTH);
    
    const sliderContainerRef = useRef(null);

    const init = () => {
            const sliderWidth = window.innerWidth-50;
            setWidth(sliderWidth);
    };

    useEffect(() => {
        init();
        window.addEventListener('resize', init);
        return () => {
            window.removeEventListener('resize', init);
        };
    }, []);

    const getSlidesContainerStylesWithWidth = ()=>({
        width:  width < MAX_IMAGE_WIDTH ? width : MAX_IMAGE_WIDTH + 'px',
        transform: `translateX(${-(currentIndex * (width < MAX_IMAGE_WIDTH ? width : MAX_IMAGE_WIDTH))}px)`
    })
    const imagesStyle = () => ({
        width: width < MAX_IMAGE_WIDTH ? width + 'px' : MAX_IMAGE_WIDTH + 'px',
        height: 'auto'
    });
    
    const [startX, setStartX] = useState(0);
    const [isDown, setIsDown] = useState(false)
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDown(true);
        if (sliderContainerRef.current) {
            sliderContainerRef.current.classList.add('active');
            setStartX(e.pageX - sliderContainerRef.current.offsetLeft);
        }
    };

    const handleMouseLeave = (e) => {
        e.preventDefault();
        setIsDown(false);
        if (sliderContainerRef.current) {
            sliderContainerRef.current.classList.remove('active');
        }
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        setIsDown(false);
        if (sliderContainerRef.current) {
            sliderContainerRef.current.classList.remove('active');
        }
    };
    const handleSlideLeft = () => {
        setCurrentIndex(prevIndex => prevIndex === 0 ? slides.length - 1 : prevIndex - 1);
    };
    
    const handleSlideRight = ()=>{
        setCurrentIndex(prevIndex => prevIndex === slides.length - 1 ? 0 : prevIndex + 1)
    }
    const handleMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - sliderContainerRef.current.offsetLeft;
        const walk = x - startX;
        const direction = walk > 0 ? 1 : -1;
        
        if (direction === -1) {
            handleSlideRight();
            setIsDown(false);
        } else if (direction === 1) {
            handleSlideLeft();
            setIsDown(false);
        }
    };
    
    
    return (
        <div className="slider">
            <div className='small-slider'>  
                {slides.map((el, index) => (
                    <div key={index} className='slider-item' onClick={() => setCurrentIndex(index)}>
                        <img src={el.image} alt="image" />
                    </div>  
                ))}
            </div>
            <div className='slider-container'
                ref={sliderContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave} >
                <div className='slider-line' style={getSlidesContainerStylesWithWidth()}>
                    {slides.map((el, slideIndex) => (
                        <div key={slideIndex} className='slide-item'>
                            <img style={imagesStyle()} src={el.image} alt="" />
                            <button className='arrowHolder left-arrow' onClick={handleSlideLeft}><img src="images/leftArrow.svg" alt="" /></button>
                            <button className='arrowHolder right-arrow' onClick={handleSlideRight}><img src="images/rightArrow.svg" alt="" /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
