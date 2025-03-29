// script.js

// Example: Search Functionality for Techniques
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('#search-box');
    const techniquesList = document.querySelectorAll('.technique');
  
    searchBox.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
  
      techniquesList.forEach(function(technique) {
        const title = technique.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
          technique.style.display = 'block';
        } else {
          technique.style.display = 'none';
        }
      });
    });
  });
  let currentSlide = 0;

  function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const carouselInner = document.querySelector('.carousel-inner');
  
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
  
    const offset = -currentSlide * 100;
    carouselInner.style.transform = `translateX(${offset}%)`;
  
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
  }

 
  
  

  


