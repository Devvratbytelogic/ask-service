import React from 'react'

export default function TermsPage() {
    return (
        <div className="min-h-screen body_x_axis_padding container_y_padding_lg w-full max-w-2xl md:max-w-none md:w-2/3 mx-auto space-y-10">
            <section className="w-full">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                    Annexe juridique – CGU & Mentions clés
                </h1>
                <p className="text-sm md:text-base text-darkSilver/90">
                    Ce document constitue une annexe juridique de cadrage. Il doit être validé et adapté par un professionnel du droit avant mise en production.
                </p>
            </section>
            <section className="w-full space-y-6 prose prose-sm max-w-none text-fontBlack">
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">1. Présentation de la plateforme</h2>
                    <p className="text-sm text-darkSilver/90">
                        La plateforme Ask Service est une place de mise en relation entre des clients (particuliers et professionnels) et des prestataires de services (sécurité privée, nettoyage, services similaires).
                        La plateforme agit exclusivement en tant qu'intermédiaire technique et commercial.
                        Elle ne fournit aucune prestation de service et n'emploie aucun prestataire.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">2. Définitions</h2>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li><strong>Plateforme :</strong> Ask Service</li>
                        <li><strong>Client :</strong> toute personne physique ou morale déposant une demande de service</li>
                        <li><strong>Prestataire :</strong> toute société ou professionnel inscrit proposant des services</li>
                        <li><strong>Lead :</strong> demande de service déposée par un client et mise à disposition des prestataires</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">3. Objet des CGU</h2>
                    <p className="text-sm text-darkSilver/90">
                        Les présentes Conditions Générales d'Utilisation ont pour objet de définir les conditions d'accès à la plateforme, les droits et obligations des utilisateurs, ainsi que les responsabilités respectives des parties.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">4. Rôle et responsabilité de la plateforme</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">4.1 Rôle d'intermédiaire</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Ask Service met à disposition une technologie de mise en relation, commercialise des leads auprès des prestataires, et n'intervient pas dans la négociation, l'exécution ou la facturation des prestations.
                    </p>
                    <h3 className="text-base font-medium text-fontBlack mb-1">4.2 Exclusion de responsabilité</h3>
                    <p className="text-sm text-darkSilver/90">
                        Ask Service ne saurait être tenue responsable de la qualité des prestations réalisées, des litiges entre clients et prestataires, ni des manquements légaux ou contractuels des prestataires.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">5. Conditions applicables aux clients</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">Droits</h3>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>Déposer gratuitement une demande de service</li>
                        <li>Être contacté par des prestataires</li>
                    </ul>
                    <h3 className="text-base font-medium text-fontBlack mb-1">Obligations</h3>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>Fournir des informations exactes</li>
                        <li>Ne pas utiliser la plateforme à des fins frauduleuses</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">6. Conditions applicables aux prestataires</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">6.1 Inscription et vérification</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        L'inscription est soumise à la fourniture de documents légaux valides (Kbis, assurances, agréments) et à la validation par l'administrateur.
                        Ask Service se réserve le droit de refuser ou suspendre un compte.
                    </p>
                    <h3 className="text-base font-medium text-fontBlack mb-1">6.2 Achat de leads</h3>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>Les leads sont vendus à titre d'opportunité commerciale.</li>
                        <li>L'achat d'un lead ne garantit pas la conclusion d'un contrat.</li>
                        <li>Aucun remboursement n'est dû en cas d'absence de conversion.</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">7. Modèle économique</h2>
                    <p className="text-sm text-darkSilver/90">
                        La plateforme est rémunérée par la vente de leads et des packs ou abonnements optionnels.
                        Les prix sont affichés hors taxes.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">8. Sécurité privée – Clause spécifique</h2>
                    <p className="text-sm text-darkSilver/90">
                        Pour les services de sécurité et gardiennage, le prestataire certifie être titulaire des autorisations légales nécessaires et agit sous sa seule responsabilité.
                        Ask Service ne peut être assimilée à un employeur.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">9. Données personnelles (RGPD)</h2>
                    <p className="text-sm text-darkSilver/90">
                        Les données collectées sont utilisées uniquement pour la mise en relation, la gestion des comptes et la facturation.
                        Conformément au RGPD, chaque utilisateur dispose d'un droit d'accès, de rectification et de suppression.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">10. Propriété intellectuelle</h2>
                    <p className="text-sm text-darkSilver/90">
                        Tous les éléments de la plateforme (marque, logo, contenus) sont protégés.
                        Toute reproduction est interdite sans autorisation.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">11. Suspension et résiliation</h2>
                    <p className="text-sm text-darkSilver/90">
                        Ask Service se réserve le droit de suspendre un compte en cas de manquement et de supprimer tout contenu illicite.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">12. Droit applicable et juridiction compétente</h2>
                    <p className="text-sm text-darkSilver/90">
                        Les présentes CGU sont soumises au droit français.
                        Tout litige relèvera de la compétence des tribunaux français.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">13. Mentions légales</h2>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li><strong>Raison sociale :</strong> ASK SERVICE</li>
                        <li><strong>Forme juridique :</strong> SAS</li>
                        <li><strong>Capital social :</strong> 500 euros</li>
                        <li><strong>Siège social :</strong> 10 – 12 Avenue Parmentier 93420 Villepinte</li>
                        <li><strong>RCS :</strong> de Bobigny</li>
                        <li><strong>Directeur de publication :</strong> Boubacar DABO</li>
                        <li><strong>Hébergeur :</strong> OVH</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">14. Avertissement final</h2>
                    <p className="text-sm text-darkSilver/90">
                        Ce document constitue une annexe juridique de cadrage. Il doit être validé et adapté par un professionnel du droit avant mise en production.
                    </p>
                </div>
            </section>
        </div>
    )
}
