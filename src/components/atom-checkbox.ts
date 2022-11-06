const checkBox = document.createElement('input');
checkBox.type = 'checkbox';
checkBox.name = 'enableRotation';
checkBox.value = 'enable rotation';

const label = document.createElement('label');
label.htmlFor = 'enableRotation';
label.appendChild(document.createTextNode('Enable rotation'));

const checkBoxContainer = document.createElement('div');
checkBoxContainer.id = 'checkBoxContainer';
checkBoxContainer.appendChild(checkBox);
checkBoxContainer.appendChild(label);

document.body.appendChild(checkBoxContainer);

export { checkBoxContainer };
