function toggleMore(id) {
    const element = document.getElementById(id);
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

// function showSidebar(){
//     const sidebar = document.querySelector('.sidebar');
//     sidebar.style.display = 'flex';
// }
// function hideSidebar(){
//     const sidebar = document.querySelector('.sidebar');
//     sidebar.style.display = 'none';
// }

