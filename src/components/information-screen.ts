import IJSONAtom from '../entities/IJSONAtom';

const updateInformationScreen = (name: IJSONAtom) => {
  document.querySelector('#information-screen')?.remove();

  const informationScreen = document.createElement('div');
  informationScreen.id = 'information-screen';

  const informationScreenTitle = document.createElement('h1');
  informationScreenTitle.id = 'information-screen-title';
  informationScreenTitle.innerHTML = name.name;
  informationScreen.appendChild(informationScreenTitle);

  const minifyButton = document.createElement('button');
  minifyButton.id = 'minify-button';
  minifyButton.innerHTML = '-';
  minifyButton.addEventListener('click', () => {
    minifyButton.innerText = minifyButton.innerText == '-' ? '+' : '-';
    informationScreenContent.classList.toggle('minified');
  });
  informationScreen.appendChild(minifyButton);

  const informationScreenContent = document.createElement('div');
  informationScreenContent.id = 'information-screen-content';
  informationScreen.appendChild(informationScreenContent);
  informationScreenContent.innerHTML = `
        <div class="information-screen-content-item">
            <h2>Atomic Number</h2>
            <p>${name.atomicNumber}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Symbol</h2>
            <p>${name.symbol}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Atomic Mass</h2>
            <p>${name.atomicMass}</p>
        </div>
        <div class="information-screen-content-item">   
            <h2>Electron Configuration</h2>
            <p>${name.electronicConfiguration}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Electronegativity</h2>
            <p>${name.electronegativity}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Atomic Radius</h2>
            <p>${name.atomicRadius}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Ion Radius</h2>
            <p>${name.ionRadius}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Van der Waals Radius</h2>
            <p>${name.vanDerWaalsRadius}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Ionization Energy</h2>
            <p>${name.ionizationEnergy}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Electron Affinity</h2>
            <p>${name.electronAffinity}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Oxidation States</h2>
            <p>${name.oxidationStates}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Standard State</h2>
            <p>${name.standardState}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Melting Point</h2>
            <p>${name.meltingPoint}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Boiling Point</h2>
            <p>${name.boilingPoint}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Density</h2>
            <p>${name.density}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Group Block</h2>
            <p>${name.groupBlock}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Year Discovered</h2>
            <p>${name.yearDiscovered}</p>
        </div>
        <div class="information-screen-content-item">
            <h2>Block</h2>
            <p>${name.block}</p>
        </div<div class="information-screen-content-item">
        `;
  document.body.appendChild(informationScreen);
};

export default updateInformationScreen;
