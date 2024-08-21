//access to tabs and panels
const tabs = [...document.querySelectorAll('[role=tab]')]

function handleTabClick(e) {
    const panels = [...document.querySelectorAll('[role=tabpanel]')]

    const panelToControl = e.currentTarget.getAttribute('aria-controls');
    console.log(panelToControl);
    panels.forEach(panel => {
        console.log(panel.id);
        
        panel.setAttribute('aria-hidden', 
            panel.id === panelToControl ? 
                'false' : 'true');
    });
    tabs.forEach(tab => {
        tab.setAttribute('aria-selected', 
            tab === e.currentTarget ?
                'true' : 'false');
    });
}

function handleKeyDown(e) {
    const activeElement = document.activeElement;

    switch(e.key) {
        case 'ArrowLeft':
            if(tabs[0] === activeElement) {
                return tabs[tabs.length - 1].focus();
            }
            return activeElement.previousElementSibling.focus();
        case 'ArrowRight':
            if(tabs[tabs.length - 1] === activeElement) {
                return tabs[0].focus;
            }
            return activeElement.nextElementSibling.focus();
        default:
            return;
    }
}

function getPreviousPeriod(period) {
    switch (period) {
        case 'daily':
            return 'Yesterday';
        case 'weekly':
            return 'Last week';
        case 'monthly':
            return 'Last month';
        default:
            return;
    }
}

function retrieveTimeData(obj, time) {
    return obj.period[time];   
}

function generateHTMLString(data) {
    
    const htmlString = Object.entries(data).map(period => {
        console.log(period);
        
        return `
            <div class="timecards" role="tabpanel" aria-labelledby="tab-${period[0]}" id="panel-${period[0]}" aria-hidden="${period[0] === 'daily' ? 'false' : 'true'}">
                <div class="work">
                    <div class="card-top">
                        <div class="card">
                            <div class="card__first-row">
                                <h2 class="card__first-row__title">Work</h2>
                                <button class="icon-ellipsis"></button>
                            </div>
                            <div class="card__second-row">
                                <p class="current">${retrieveTimeData(...period[1].filter(activity => activity.title === 'Work'), 'current')}hrs</p>
                                <p class="previous">${getPreviousPeriod(period[0])} - ${retrieveTimeData(...period[1].filter(activity => activity.title === 'Work'), 'previous')}hrs</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="play">
                    <div class="card-top">
                        <div class="card">
                            <div class="card__first-row">
                                <h2 class="card__first-row__title">Play</h2>
                                <button class="icon-ellipsis"></button>
                            </div>
                            <div class="card__second-row">
                                <p class="current">${retrieveTimeData(...period[1].filter(activity => activity.title === 'Play'), 'current')}hrs</p>
                                <p class="previous">${getPreviousPeriod(period[0])} - ${retrieveTimeData(...period[1].filter(activity => activity.title === 'Play'), 'previous')}hrs</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="study">
                    <div class="card-top">
                        <div class="card">
                            <div class="card__first-row">
                                <h2 class="card__first-row__title">Study</h2>
                                <button class="icon-ellipsis"></button>
                            </div>
                            <div class="card__second-row">
                                <p class="current">${retrieveTimeData(...period[1].filter(activity => activity.title === 'Study'), 'current')}hrs</p>
                                <p class="previous">${getPreviousPeriod(period[0])} - ${retrieveTimeData(...period[1].filter(activity => activity.title === 'Study'), 'previous')}hrs</p>
                            </div>                        
                        </div>
                    </div>
                </div>
                <div class="exercise">
                    <div class="card-top">
                        <div class="card">
                            <div class="card__first-row">
                                <h2 class="card__first-row__title">Exercise</h2>
                                <button class="icon-ellipsis"></button>
                            </div>
                            <div class="card__second-row">
                                <p class="current">${retrieveTimeData(...period[1].filter(activity => activity.title === 'Exercise'), 'current')}hrs</p>
                                <p class="previous">${getPreviousPeriod(period[0])} - ${retrieveTimeData(...period[1].filter(activity => activity.title === 'Exercise'), 'previous')}hrs</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="social">
                    <div class="card-top">
                        <div class="card">
                            <div class="card__first-row">
                                <h2 class="card__first-row__title">Social</h2>
                                <button class="icon-ellipsis"></button>
                            </div>
                            <div class="card__second-row">
                                <p class="current">${retrieveTimeData(...period[1].filter(activity => activity.title === 'Social'), 'current')}hrs</p>
                                <p class="previous">${getPreviousPeriod(period[0])} - ${retrieveTimeData(...period[1].filter(activity => activity.title === 'Social'), 'previous')}hrs</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="self-care">
                    <div class="card-top">
                        <div class="card">
                            <div class="card__first-row">
                                <h2 class="card__first-row__title">Self Care</h2>
                                <button class="icon-ellipsis"></button>
                            </div>
                            <div class="card__second-row">
                                <p class="current">${retrieveTimeData(...period[1].filter(activity => activity.title === 'Self Care'), 'current')}hrs</p>
                                <p class="previous">${getPreviousPeriod(period[0])} - ${retrieveTimeData(...period[1].filter(activity => activity.title === 'Self Care'), 'previous')}hrs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }).join('');

    return htmlString;
}

//on selection of tabs, show panel
tabs.forEach(tab => {
   tab.addEventListener('click', handleTabClick); 
});

//keyboard events
window.addEventListener('keydown', handleKeyDown);

//fetch live data
async function fetchData() {
    await fetch('../data.json')
        .then(response => response.json())
        .then(body => {            
            const dailyTimeframe = body.map(type => ({
                title: type.title,
                period: type.timeframes.daily 
            }));

            const weeklyTimeframe = body.map(type => ({
                title: type.title,
                period: type.timeframes.weekly 
            }));

            const monthlyTimeframe = body.map(type => ({
                title: type.title,
                period: type.timeframes.monthly 
            }));            

            const panelContainers = document.createElement('div');
            panelContainers.className = 'panel-containers';
            panelContainers.innerHTML = generateHTMLString({
                daily: dailyTimeframe, 
                weekly: weeklyTimeframe, 
                monthly: monthlyTimeframe
            });

            const containerElement = document.querySelector('.container');
            containerElement.appendChild(panelContainers);
        })
        .catch(error => console.log(error));
}

fetchData();