import React from 'react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen body_x_axis_padding container_y_padding_lg w-full max-w-2xl md:max-w-none md:w-2/3 mx-auto space-y-10">
            <section className="w-full">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                    Politique de confidentialité – RGPD
                </h1>
                <p className="text-sm md:text-base text-darkSilver/90">
                    La présente politique de confidentialité a pour objectif d'informer les utilisateurs de la plateforme Ask Service sur la manière dont leurs données personnelles sont collectées, utilisées et protégées, conformément au Règlement Général sur la Protection des Données (RGPD – UE 2016/679).
                </p>
            </section>
            <section className="w-full space-y-6 prose prose-sm max-w-none text-fontBlack">
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">1. Responsable du traitement</h2>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li><strong>Nom commercial :</strong> Ask Service</li>
                        <li><strong>Raison sociale :</strong> SAS Ask Service</li>
                        <li><strong>Adresse :</strong> 10 – 12 Avenue Parmentier 93420 Villepinte</li>
                        <li><strong>Email de contact RGPD :</strong> contact@askservice.fr</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">2. Données personnelles collectées</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">2.1 Données collectées auprès des clients</h3>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>Nom et prénom</li>
                        <li>Adresse email</li>
                        <li>Numéro de téléphone</li>
                        <li>Adresse de la prestation</li>
                        <li>Détails de la demande de service</li>
                        <li>Adresse IP</li>
                    </ul>
                    <h3 className="text-base font-medium text-fontBlack mb-1">2.2 Données collectées auprès des prestataires</h3>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>Nom de la société</li>
                        <li>Nom du représentant légal</li>
                        <li>Adresse email professionnelle</li>
                        <li>Numéro de téléphone</li>
                        <li>Adresse</li>
                        <li>Documents légaux (Kbis, assurance, agréments)</li>
                        <li>Historique des achats de leads</li>
                    </ul>
                    <h3 className="text-base font-medium text-fontBlack mb-1">2.3 Données collectées automatiquement</h3>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>Adresse IP</li>
                        <li>Données de navigation</li>
                        <li>Cookies et traceurs</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">3. Finalités du traitement</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">Les données personnelles sont collectées pour les finalités suivantes :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>Mise en relation entre clients et prestataires</li>
                        <li>Génération et vente de leads</li>
                        <li>Gestion des comptes utilisateurs</li>
                        <li>Vérification des prestataires</li>
                        <li>Facturation et paiements</li>
                        <li>Amélioration de la plateforme</li>
                        <li>Respect des obligations légales</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">4. Base légale du traitement</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">Les traitements sont fondés sur :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>Le consentement de l'utilisateur</li>
                        <li>L'exécution d'un contrat ou de mesures précontractuelles</li>
                        <li>L'obligation légale</li>
                        <li>L'intérêt légitime de la plateforme</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">5. Destinataires des données</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">Les données personnelles peuvent être transmises à :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-2">
                        <li>Prestataires de services (uniquement après achat d'un lead)</li>
                        <li>Prestataires techniques (hébergement, paiement, emailing)</li>
                        <li>Autorités administratives ou judiciaires si requis par la loi</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">Aucune donnée n'est vendue à des tiers non autorisés.</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">6. Durée de conservation</h2>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li><strong>Données clients :</strong> 24 mois après la dernière interaction</li>
                        <li><strong>Données prestataires :</strong> durée de la relation contractuelle + 5 ans</li>
                        <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
                        <li><strong>Cookies :</strong> 13 mois maximum</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">7. Sécurité des données</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">
                        Ask Service met en œuvre des mesures techniques et organisationnelles appropriées afin de garantir la sécurité et la confidentialité des données, notamment :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>Accès restreint aux données</li>
                        <li>Chiffrement des communications</li>
                        <li>Hébergement sécurisé</li>
                        <li>Journalisation des accès</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">8. Droits des utilisateurs</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">Conformément au RGPD, chaque utilisateur dispose des droits suivants :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-2">
                        <li>Droit d'accès</li>
                        <li>Droit de rectification</li>
                        <li>Droit à l'effacement</li>
                        <li>Droit à la limitation du traitement</li>
                        <li>Droit d'opposition</li>
                        <li>Droit à la portabilité</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">
                        Toute demande peut être adressée à : <strong>contact@askservice.fr</strong>
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">9. Cookies et traceurs</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">La plateforme utilise des cookies afin de :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-2">
                        <li>Assurer le bon fonctionnement du site</li>
                        <li>Mesurer l'audience</li>
                        <li>Améliorer l'expérience utilisateur</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">
                        Un bandeau de consentement permet à l'utilisateur d'accepter ou refuser les cookies non essentiels.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">10. Transfert des données hors UE</h2>
                    <p className="text-sm text-darkSilver/90">
                        Les données sont hébergées au sein de l'Union européenne.
                        En cas de transfert hors UE, Ask Service s'assure que des garanties appropriées sont mises en place conformément au RGPD.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">11. Modification de la politique</h2>
                    <p className="text-sm text-darkSilver/90">
                        La présente politique peut être modifiée à tout moment.
                        Les utilisateurs seront informés de toute modification substantielle.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">12. Contact et réclamation</h2>
                    <p className="text-sm text-darkSilver/90">
                        Pour toute question relative à la protection des données : <strong>contact@askservice.fr</strong>
                    </p>
                    <p className="text-sm text-darkSilver/90 mt-1">
                        En cas de litige, l'utilisateur peut déposer une réclamation auprès de la CNIL.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">13. Date de mise à jour</h2>
                    <p className="text-sm text-darkSilver/90">Dernière mise à jour : 27/03/2026</p>
                </div>
            </section>
        </div>
    )
}
