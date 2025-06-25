document.addEventListener('DOMContentLoaded', () => {
    const logos = document.querySelectorAll('.logo');
    const prevButton = document.getElementById('prev-logo');
    const nextButton = document.getElementById('next-logo');
    let currentIndex = 0;

    function updateLogo() {
        // Remove a classe 'active' de todos os logos
        logos.forEach(logo => logo.classList.remove('active'));

        // Adiciona a classe 'active' ao logo atual
        const currentLogo = logos[currentIndex];
        currentLogo.classList.add('active');

        // Atualiza o tema do body com base no data-attribute do logo
        const activeCompany = currentLogo.dataset.company;
        document.body.dataset.theme = activeCompany;
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + logos.length) % logos.length;
        updateLogo();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % logos.length;
        updateLogo();
    });

    // Inicia com o primeiro logo visível
    updateLogo();
});