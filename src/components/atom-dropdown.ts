const dropDownElement = document.createElement('select');
const dropDown = document.body.appendChild(dropDownElement);

dropDownElement.id = 'select-atoms';
dropDownElement.name = 'select-atoms';
dropDownElement.value = 'Hydrogen';

export { dropDown };
