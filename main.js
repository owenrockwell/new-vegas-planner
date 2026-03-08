
function calculateSkills() {
  skills.forEach(skill => {
    const thisSpecial = special.find(s => s.name == skill.special);
    let value = Math.round(2 + (2 * thisSpecial.value) + (thisSpecial.value / 2)) + Number(skill.value);
    skill.calculatedValue = skill.tagSkill ? value + 15 : value;
  })
}

function renderComponents()
{
  calculateSkills()
  createControls(special, true)
  createControls(skills)
  createPerks();
  lockTagSkills();
}

function reload() {
  document.body.innerHTML = "";
  renderComponents();
}

function createControls(array, isSpecial) {
  const controls = document.createElement('section');
  controls.classList.add(isSpecial ? 'special' : 'skill');

  array.forEach(item => {
    const label = document.createElement('label') 
    label.textContent = item.name;
    
    const control = document.createElement('input') 
    control.id = item.name;
    control.value = item.value;
    control.type = "Number";
    control.min = isSpecial ? 1 : 0;
    control.max = isSpecial ? 10 : 100;

    control.addEventListener("change", () => {
      item.value = control.value;
      reload()
    })
    

    if (!isSpecial) {
      //tag-skill checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = item.tagSkill;

      checkbox.addEventListener('change', () => {
          item.tagSkill = checkbox.checked;
          reload();
      })

      label.append(checkbox);

      //derived value
      const calculated = document.createElement('input');
      calculated.value = item.calculatedValue;
      control.max -= item.calculatedValue;
      calculated.disabled = true;

      label.append(calculated)
    } 

    label.append(control)

    controls.append(label)
  })

  document.body.append(controls);
}

function createPerks() {
  const perkSection = document.createElement("section")
  perkSection.className = "perks"

  perks.forEach((perk) => {
    const perkCard = document.createElement("article")
    perkCard.innerHTML = `<h3>${perk.Name}</h3><p>${perk.Description}</p><i>Level: ${perk.Level}<br/>`
    
    Object.keys(perk.Requirements).forEach(requirement => {
      const requiredSpecial = special.find(s => s.name == requirement)?.value;
      const requiredSkill = skills.find(s => s.name == requirement)?.calculatedValue;
      const value = requiredSpecial ? requiredSpecial : requiredSkill;

      if (special[requirement]) value = special[requirement].value;
      if (skills[requirement]) value = skills[requirement].calculatedValue;

      perkCard.innerHTML += value !== undefined 
      ? `<i>${requirement}: ${perk.Requirements[requirement]}</i><br>`
      : `<i>Requires ${perk.Requirements[requirement]}</i><br>`

      if (value < perk.Requirements[requirement]) {
        perkCard.classList.add('unrequired');
      };
    })

    perkSection.append(perkCard)  
  })
  document.body.append(perkSection)
}

function lockTagSkills() {
  const tags = Array.from(document.querySelectorAll('.skill [type=checkbox]'));
  if (tags.filter(tag => tag.checked).length < 3 ) return;
  tags.forEach(tag => tag.disabled = !tag.checked)
}
