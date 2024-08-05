const period = document.querySelector('.card__header__period');
const cards = document.querySelectorAll('.card');
const links = document.querySelectorAll('.link');
const allCurrentTimeframes = document.querySelectorAll('.current');
const allPreviousTimeframes = document.querySelectorAll('.previous');

fetch('../data.json')
    .then((response) => response.json())
    .then((data) => {
        initialContentDisplay(cards, data);

        links.forEach((link) => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                cards.forEach((card, index) => {
                    const timeframe = link.getAttribute('data-timeframe');
                    const classSelector = ".card__second-row__" + timeframe;
                    const current = card.querySelector(classSelector + " .current");
                    const previous = card.querySelector(classSelector + " .previous");
                    const title = card.querySelector("card__first-row__title");
                    current.textContent = data[index].timeframes[timeframe].current + "hrs";
                    const goodName = timeframe.replace(/ly/, "").replace(/i/, 'y');
                    previous.textContent = 
                        "Last " + 
                        goodName + 
                        " - " + 
                        data[index].timeframes[timeframe].previous +
                        "hrs";

                    allCurrentTimeframes.forEach((currentTimeframe) => currentTimeframe.classList.remove('active'));
                    allPreviousTimeframes.forEach((previousTimeframe) => previousTimeframe.classList.remove('active'));
                    current.classList.add('active');
                    previous.classList.add('active');
                });
            })
        });
    })
    .catch((error) => console.log(error));

function initialContentDisplay(cards, data) {
    cards.forEach((card, index) => {
        const title = card.querySelector('.card__first-row__title');
        const current = card.querySelector('.card__second-row__daily .current');
        const previous = card.querySelector('.card__second-row__daily .previous');

        title.textContent = data[index].title;
        current.textContent = data[index].timeframes.weekly.current + "hrs";
        previous.textContent = "Last Week - " + data[index].timeframes.weekly.previous + "hrs";
        current.classList.add('active');
        previous.classList.add('active');
    });
    
}