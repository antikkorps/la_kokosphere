export default {
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  groups: [
    {name: 'social', title: 'Réseaux sociaux', default: true},
    {name: 'practitioner', title: 'Praticienne'},
  ],
  fields: [
    {
      name: 'title',
      title: 'Libellé interne',
      type: 'string',
      initialValue: 'Paramètres du site',
      readOnly: true,
      hidden: true,
    },

    // --- Réseaux sociaux / profils externes (schema.org sameAs) ---
    {
      name: 'googleBusinessUrl',
      title: 'Fiche Google Business Profile',
      type: 'url',
      group: 'social',
      description:
        "L'adresse publique de votre fiche Google (bouton « Partager » sur la fiche). C'est le lien le plus important pour le référencement local.",
    },
    {
      name: 'facebookUrl',
      title: 'Facebook',
      type: 'url',
      group: 'social',
      description: 'Ex. https://www.facebook.com/lakokosphere',
    },
    {
      name: 'instagramUrl',
      title: 'Instagram',
      type: 'url',
      group: 'social',
      description: 'Ex. https://www.instagram.com/lakokosphere',
    },
    {
      name: 'linkedinUrl',
      title: 'LinkedIn',
      type: 'url',
      group: 'social',
      description: 'Profil ou page LinkedIn',
    },
    {
      name: 'youtubeUrl',
      title: 'YouTube',
      type: 'url',
      group: 'social',
      description: 'Chaîne YouTube',
    },
    {
      name: 'tiktokUrl',
      title: 'TikTok',
      type: 'url',
      group: 'social',
    },
    {
      name: 'otherProfiles',
      title: 'Autres profils publics',
      type: 'array',
      group: 'social',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Nom du site',
              type: 'string',
              description: 'Ex. Doctolib, Annuaire Thérapeutes, Pages Jaunes…',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Adresse',
              type: 'url',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'showInFooter',
              title: 'Afficher dans le pied de page',
              type: 'boolean',
              initialValue: false,
              description:
                'Décoché, le lien reste transmis à Google mais ne s’affiche pas sur le site.',
            },
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
      description:
        'Annuaires santé, plateformes de prise de rendez-vous, autres profils vous concernant.',
    },

    // --- Identité de la praticienne (E-E-A-T) ---
    {
      name: 'practitionerName',
      title: 'Nom de la praticienne',
      type: 'string',
      group: 'practitioner',
      description:
        'Nom réel affiché dans les données structurées. Google associe la personne au site et à la fiche Google.',
      initialValue: 'Cécile Pascual',
    },
    {
      name: 'practitionerJobTitle',
      title: 'Intitulé professionnel',
      type: 'string',
      group: 'practitioner',
      initialValue: 'Hypnothérapeute certifiée',
    },
    {
      name: 'practitionerDescription',
      title: 'Présentation courte',
      type: 'text',
      rows: 3,
      group: 'practitioner',
    },
    {
      name: 'credentials',
      title: 'Diplômes et certifications',
      type: 'array',
      group: 'practitioner',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Intitulé',
              type: 'string',
              description: 'Ex. Praticienne en hypnose ericksonienne',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'issuer',
              title: 'Organisme de formation',
              type: 'string',
              description: "Nom de l'école ou de l'organisme certificateur",
            },
            {
              name: 'issuerUrl',
              title: "Site de l'organisme",
              type: 'url',
            },
            {
              name: 'year',
              title: 'Année',
              type: 'string',
            },
          ],
          preview: {select: {title: 'name', subtitle: 'issuer'}},
        },
      ],
    },
  ],

  preview: {
    prepare() {
      return {title: 'Paramètres du site'}
    },
  },
}
