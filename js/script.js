async function loadProjectsDetails() {
  try {
    const { data } = await axios.get('https://gabistam.github.io/Demo_API/data/projects.json');

    if (Array.isArray(data.projects)) {
      data.projects.forEach(project => {
        Object.values(project).forEach(detail => {
          console.log(detail);
        });
      });
    } else {
      console.warn('Structure inattendue :', data.projects);
    }

  } catch (error) {
    console.error('Erreur de chargement :', error.message);
  }
}

async function loadCategories() {
  try {
    const { data } = await axios.get('https://gabistam.github.io/Demo_API/data/projects.json');
    const categorySelect = document.getElementById('category-select');

    categorySelect.innerHTML = '<option value="">-- Toutes les catégories --</option>';

    if (Array.isArray(data.projects)) {
      const categories = [...new Set(data.projects.map(p => p.category))];

      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    }

    categorySelect.addEventListener('change', function () {
      filterProjectsByCategory(this.value);
    });

  } catch (error) {
    console.error('Erreur de chargement des catégories :', error.message);
  }
}

async function loadTechnologies() {
  try {
    const { data } = await axios.get('https://gabistam.github.io/Demo_API/data/projects.json');

    if (Array.isArray(data.technologies)) {
      console.log('Technologies :', data.technologies);
    } else {
      console.warn('Structure inattendue :', data.technologies);
    }

  } catch (error) {
    console.error('Erreur de chargement :', error.message);
  }
}

async function filterProjectsByCategory(categoryId) {
  try {
    const { data } = await axios.get('https://gabistam.github.io/Demo_API/data/projects.json');
    const projectsContainer = document.getElementById('project-cards');

    let filteredProjects = [];

    if (categoryId === "") {
      filteredProjects = data.projects;
    } else {
      filteredProjects = data.projects.filter(project =>
        project.category === categoryId || project.category_id === categoryId
      );
    }

    displayProjects(filteredProjects);

  } catch (error) {
    console.error('Erreur de filtrage :', error.message);
  }
}

function displayProjects(projects) {
  const container = document.getElementById('project-cards');
  container.innerHTML = '';

  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';

    let techBadges = '';
    if (Array.isArray(project.technologies)) {
      project.technologies.forEach(tech => {
        techBadges += `<span class="tech-badge">${tech}</span>`;
      });
    } else {
      techBadges = '<span class="tech-badge">Technologie inconnue</span>';
    }

    projectCard.innerHTML = `
      <img src="${project.image || 'images/default.jpg'}" alt="${project.title}" class="card-image">
      <div class="card-content">
        <h3 class="card-title">${project.title}</h3>
        <p class="card-client"><strong>Client :</strong> ${project.client || 'Non spécifié'}</p>
        <div class="card-technologies">${techBadges}</div>
        <button class="details-button" data-id="${project.id}">Voir détails</button>
      </div>
    `;

    container.appendChild(projectCard);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  loadCategories();
  filterProjectsByCategory("");
});

loadProjectsDetails();

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('details-button')) {
    const projectId = event.target.getAttribute('data-id');
    showProjectModal(projectId);
  }
});

async function showProjectModal(projectId) {
  try {
    const { data } = await axios.get('https://gabistam.github.io/Demo_API/data/projects.json');
    const project = data.projects.find(p => p.id.toString() === projectId);
    if (!project) {
      console.error('Projet non trouvé');
      return;
    }

    const modalHtml = `
      <div class="modal-overlay" id="project-modal" style="
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6);
        display: flex; align-items: center; justify-content: center; z-index: 1050;">
        <div class="modal-content" style="
          background: white; padding: 2rem; width: 90%; max-width: 600px; border-radius: 12px;
          position: relative; max-height: 90vh; overflow-y: auto;">
          <button id="modal-close" style="
            position: absolute; top: 10px; right: 10px; border:none; background:none; font-size:1.5rem; cursor:pointer;">&times;</button>
          <h2>${project.title}</h2>
          <p><strong>Client:</strong> ${project.client || 'Non spécifié'}</p>
          <p><strong>Catégorie:</strong> ${project.category || 'Non spécifié'}</p>
          <p><strong>Description:</strong> ${project.description || 'Pas de description fournie.'}</p>
          
          ${project.features && project.features.length > 0 ? `
            <h3>Fonctionnalités :</h3>
            <ul>
              ${project.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          ` : ''}
          
          <p><a href="${project.link || '#'}" target="_blank" rel="noopener noreferrer">Visiter le site</a></p>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');

    closeBtn.addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) { 
        modal.remove();
      }
    });

  } catch (error) {
    console.error('Erreur lors du chargement du projet pour le modal :', error.message);
  }
}
