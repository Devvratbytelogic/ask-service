import React from 'react'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-appBg page_container w-full space-y-10">
            <section className="w-full">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                    Conditions Générales d&apos;Utilisation & Mentions Légales
                </h1>
                <p className="text-sm md:text-base text-darkSilver/90 mb-4">
                    Version 1.0 — Août 2026
                </p>
                {/* <ul className="text-sm text-darkSilver/90 list-none space-y-1">
                    <li><strong className="text-fontBlack">Raison sociale :</strong> ASK SERVICE SAS</li>
                    <li><strong className="text-fontBlack">Siège social :</strong> 93420 Villepinte</li>
                    <li><strong className="text-fontBlack">Capital social :</strong> 500,00 €</li>
                </ul> */}
            </section>

            <section className="w-full space-y-8 prose prose-sm max-w-none text-fontBlack">
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">1. Présentation de la plateforme</h2>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Ask Service est une plateforme numérique opérée par la société ASK SERVICE SAS, ayant pour objet la mise en relation entre:
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>des clients, particuliers ou professionnels, souhaitant obtenir des devis pour des services à domicile ou professionnels ;</li>
                        <li>des prestataires de services, professionnels indépendants ou sociétés, proposant leurs services dans les domaines couverts par la plateforme.</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        La plateforme intervient exclusivement en qualité d&apos;intermédiaire technique et commercial. Elle ne fournit aucune prestation de service, n&apos;emploie aucun des prestataires référencés, et n&apos;est partie à aucun contrat de prestation conclu entre les utilisateurs.
                    </p>
                    <p className="text-sm text-darkSilver/90">
                        Les services couverts au lancement : Nettoyage · Jardinage · Sécurité privée · Déménagement.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">2. Définitions</h2>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Au sens des présentes Conditions Générales d&apos;Utilisation, les termes suivants désignent :
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-darkSilver/90 border-collapse">
                            <thead>
                                <tr className="border-b border-appBorderSub text-left">
                                    <th className="py-2 pr-4 font-semibold text-fontBlack">Terme</th>
                                    <th className="py-2 font-semibold text-fontBlack">Définition</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4 font-medium text-fontBlack">Plateforme</td>
                                    <td className="py-2">Le site web et les services numériques exploités sous la marque Ask-Service, accessible à l&apos;adresse askservice.fr.</td>
                                </tr>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4 font-medium text-fontBlack">Client</td>
                                    <td className="py-2">Toute personne physique ou morale, agissant à titre personnel ou professionnel, qui dépose une demande de service via la Plateforme.</td>
                                </tr>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4 font-medium text-fontBlack">Prestataire</td>
                                    <td className="py-2">Tout professionnel indépendant ou toute société dûment inscrit(e) sur la Plateforme, proposant des services dans les domaines couverts.</td>
                                </tr>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4 font-medium text-fontBlack">Prospect</td>
                                    <td className="py-2">Demande de service qualifiée déposée par un Client, dont les coordonnées sont mises à disposition d&apos;un ou plusieurs Prestataires après achat de crédits.</td>
                                </tr>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4 font-medium text-fontBlack">Crédits</td>
                                    <td className="py-2">Unités monétaires virtuelles achetées par les Prestataires et utilisées pour débloquer l&apos;accès aux coordonnées des Clients (Leads).</td>
                                </tr>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4 font-medium text-fontBlack">KYC</td>
                                    <td className="py-2">Processus de vérification d&apos;identité et de conformité documentaire appliqué aux Prestataires lors de leur inscription (Know Your Customer).</td>
                                </tr>
                                <tr className="align-top">
                                    <td className="py-2 pr-4 font-medium text-fontBlack">CGU</td>
                                    <td className="py-2">Les présentes Conditions Générales d&apos;Utilisation, applicables à l&apos;ensemble des utilisateurs de la Plateforme.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">3. Objet des CGU</h2>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Les présentes Conditions Générales d&apos;Utilisation ont pour objet de définir :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>les conditions et modalités d&apos;accès à la Plateforme ;</li>
                        <li>les droits et obligations respectifs des Clients et des Prestataires ;</li>
                        <li>les responsabilités de chaque partie ;</li>
                        <li>les règles applicables en matière de données personnelles, de propriété intellectuelle et de résolution des litiges.</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">
                        L&apos;accès et l&apos;utilisation de la Plateforme impliquent l&apos;acceptation pleine et entière des présentes CGU. Toute utilisation contraire aux présentes est susceptible d&apos;entraîner la suspension ou la suppression du compte concerné.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">4. Rôle et responsabilité de la Plateforme</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">4.1 Statut d&apos;intermédiaire technique</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Ask Service agit en qualité d&apos;opérateur de plateforme de mise en relation au sens de l&apos;article L. 111-7 du Code de la consommation. À ce titre, la Plateforme :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>met à disposition une infrastructure technique permettant aux Clients de déposer des demandes de services et aux Prestataires d&apos;y accéder ;</li>
                        <li>commercialise des Leads auprès des Prestataires sous forme de crédits ;</li>
                        <li>n&apos;intervient à aucun titre dans la négociation, la rédaction, l&apos;exécution, la facturation ou le suivi des prestations conclues entre les parties.</li>
                    </ul>
                    <h3 className="text-base font-medium text-fontBlack mb-1">4.2 Limitation de responsabilité</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Ask Service ne saurait être tenue responsable, à quelque titre que ce soit :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>de la qualité, de la conformité ou de l&apos;exécution des prestations réalisées par les Prestataires ;</li>
                        <li>des litiges, différends ou contentieux pouvant survenir entre Clients et Prestataires ;</li>
                        <li>des manquements légaux, réglementaires, contractuels ou déontologiques des Prestataires ;</li>
                        <li>de l&apos;exactitude des informations fournies par les utilisateurs lors de leur inscription ou lors du dépôt d&apos;une demande.</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90 border-l-2 border-primaryColor/40 pl-3">
                        Ask-Service n&apos;est ni l&apos;employeur des Prestataires, ni donneur d&apos;ordres, ni co-traitant. Aucune relation de subordination ne peut être caractérisée entre Ask-Service et les Prestataires référencés.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">5. Conditions applicables aux Clients</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">5.1 Droits du Client</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Tout Client, après création d&apos;un compte vérifié, bénéficie des droits suivants :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>déposer gratuitement une ou plusieurs demandes de services ;</li>
                        <li>être contacté par des Prestataires ayant débloqué son Lead ;</li>
                        <li>consulter et comparer les propositions reçues ;</li>
                        <li>évaluer et noter les Prestataires à l&apos;issue d&apos;une prestation.</li>
                    </ul>
                    <h3 className="text-base font-medium text-fontBlack mb-1">5.2 Obligations du Client</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">Le Client s&apos;engage à :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>fournir des informations exactes, complètes et à jour lors de son inscription et lors de chaque dépôt de demande ;</li>
                        <li>ne pas déposer de demandes fictives, frauduleuses ou malveillantes ;</li>
                        <li>ne pas utiliser la Plateforme à des fins autres que la recherche de prestataires de services légaux ;</li>
                        <li>ne pas contacter directement les Prestataires en dehors de la Plateforme dans le but de contourner le système de Leads.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">6. Conditions applicables aux Prestataires</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">6.1 Inscription et vérification (KYC)</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        L&apos;accès à la Plateforme en qualité de Prestataire est soumis à un processus de vérification préalable. Le Prestataire doit fournir, à minima, les documents suivants :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>Extrait Kbis de moins de trois (3) mois, ou équivalent pour les professions libérales ;</li>
                        <li>Attestation d&apos;assurance responsabilité civile professionnelle en cours de validité ;</li>
                        <li>Agréments, certifications ou habilitations spécifiques requis pour l&apos;exercice de l&apos;activité concernée (notamment : carte professionnelle CNAPS pour les activités de sécurité privée).</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Ask-Service se réserve le droit, à sa seule discrétion, de refuser l&apos;inscription, de suspendre ou de résilier le compte d&apos;un Prestataire ne satisfaisant pas aux exigences de conformité, sans que cette décision ne puisse donner lieu à indemnisation.
                    </p>
                    <h3 className="text-base font-medium text-fontBlack mb-1">6.2 Achat et utilisation des Leads</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Le système de commercialisation des Leads fonctionne selon les modalités suivantes :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>Les Prestataires acquièrent des crédits (packs Standard, Business ou Premium) afin d&apos;accéder aux coordonnées des Clients ;</li>
                        <li>Le prix en crédits d&apos;un Lead est calculé dynamiquement en fonction des caractéristiques de la demande (service, surface, durée, profil du client, urgence, budget estimé) ;</li>
                        <li>L&apos;achat d&apos;un Lead constitue l&apos;acquisition d&apos;une opportunité commerciale et non la garantie de conclusion d&apos;un contrat de prestation ;</li>
                        <li>Aucun remboursement de crédits n&apos;est dû en cas d&apos;absence de réponse du Client, d&apos;annulation de la demande ou d&apos;absence de conversion commerciale, sauf disposition contraire expressément mentionnée dans les Conditions Générales de Vente.</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Les crédits non utilisés restent disponibles sur le compte du Prestataire sans limitation de durée, sous réserve que le compte demeure actif et en règle.
                    </p>
                    <h3 className="text-base font-medium text-fontBlack mb-1">6.3 Obligations du Prestataire</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">Le Prestataire s&apos;engage à :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>maintenir en cours de validité l&apos;ensemble des documents, assurances et agréments transmis lors de l&apos;inscription ;</li>
                        <li>informer sans délai Ask-Service de toute modification substantielle de sa situation juridique, fiscale ou réglementaire ;</li>
                        <li>respecter la législation en vigueur dans l&apos;exercice de son activité et dans ses relations avec les Clients ;</li>
                        <li>ne pas communiquer aux Clients des informations inexactes, trompeuses ou de nature à induire en erreur.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">7. Modèle économique et tarification</h2>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Ask Service est rémunérée exclusivement par la vente de Prospects et de packs de crédits aux Prestataires. La Plateforme ne perçoit aucune commission sur les prestations réalisées et ne prend aucune part dans la facturation entre Clients et Prestataires.
                    </p>
                    <p className="text-sm text-darkSilver/90">
                        Les prix sont accessibles dans l&apos;espace des prestataires et affichés hors taxes (HT). La TVA applicable est celle en vigueur le jour de la facturation. Ask Service se réserve le droit de modifier ses tarifs à tout moment, sous réserve d&apos;un préavis de trente (30) jours communiqué aux Prestataires par voie électronique.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">8. Clause spécifique — Sécurité privée et gardiennage</h2>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Les activités de sécurité privée sont encadrées par la loi n° 83-629 du 12 juillet 1983, modifiée par la loi n° 2011-267 du 14 mars 2011, et contrôlées par le Conseil National des Activités Privées de Sécurité (CNAPS).
                    </p>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Tout Prestataire proposant des services de sécurité ou de gardiennage via la Plateforme certifie expressément :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>être titulaire d&apos;une autorisation d&apos;exercice délivrée par le CNAPS en cours de validité ;</li>
                        <li>employer des agents détenteurs d&apos;une carte professionnelle valide délivrée par le CNAPS ;</li>
                        <li>respecter l&apos;ensemble des obligations légales et réglementaires applicables à son activité ;</li>
                        <li>agir sous sa seule et entière responsabilité dans le cadre des missions réalisées.</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90 border-l-2 border-primaryColor/40 pl-3">
                        Ask Service ne saurait en aucun cas être assimilée à un employeur, à un donneur d&apos;ordres ou à un coexploitant d&apos;une activité de sécurité privée. Toute responsabilité de ce chef est expressément exclue.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">9. Protection des données personnelles (RGPD)</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">9.1 Responsable du traitement</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        La société ASK SERVICE SAS, dont le siège est situé 10-12 Avenue Parmentier, 93420 Villepinte, est responsable du traitement des données à caractère personnel collectées via la Plateforme.
                    </p>
                    <h3 className="text-base font-medium text-fontBlack mb-1">9.2 Données collectées et finalités</h3>
                    <div className="overflow-x-auto mb-3">
                        <table className="w-full text-sm text-darkSilver/90 border-collapse">
                            <thead>
                                <tr className="border-b border-appBorderSub text-left">
                                    <th className="py-2 pr-4 font-semibold text-fontBlack">Catégorie de données</th>
                                    <th className="py-2 pr-4 font-semibold text-fontBlack">Finalité</th>
                                    <th className="py-2 font-semibold text-fontBlack">Base légale</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4">Identité, coordonnées</td>
                                    <td className="py-2 pr-4">Création et gestion du compte</td>
                                    <td className="py-2">Exécution du contrat</td>
                                </tr>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4">Documents KYC (Prestataires)</td>
                                    <td className="py-2 pr-4">Vérification de conformité</td>
                                    <td className="py-2">Obligation légale</td>
                                </tr>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4">Données de demande (Clients)</td>
                                    <td className="py-2 pr-4">Mise en relation et qualification</td>
                                    <td className="py-2">Exécution du contrat</td>
                                </tr>
                                <tr className="border-b border-appBorderSub/60 align-top">
                                    <td className="py-2 pr-4">Données de navigation</td>
                                    <td className="py-2 pr-4">Sécurité et amélioration du service</td>
                                    <td className="py-2">Intérêt légitime</td>
                                </tr>
                                <tr className="align-top">
                                    <td className="py-2 pr-4">Données de facturation</td>
                                    <td className="py-2 pr-4">Comptabilité et obligations fiscales</td>
                                    <td className="py-2">Obligation légale</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 className="text-base font-medium text-fontBlack mb-1">9.3 Droits des personnes concernées</h3>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés, chaque utilisateur dispose des droits suivants :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>Droit d&apos;accès aux données le concernant (art. 15 RGPD) ;</li>
                        <li>Droit de rectification des données inexactes (art. 16 RGPD) ;</li>
                        <li>Droit à l&apos;effacement (« droit à l&apos;oubli ») (art. 17 RGPD) ;</li>
                        <li>Droit à la limitation du traitement (art. 18 RGPD) ;</li>
                        <li>Droit à la portabilité des données (art. 20 RGPD) ;</li>
                        <li>Droit d&apos;opposition au traitement (art. 21 RGPD).</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">
                        Ces droits peuvent être exercés en adressant une demande écrite à : contact@askservice.fr. En cas de réponse insatisfaisante, l&apos;utilisateur dispose du droit d&apos;introduire une réclamation auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés — www.cnil.fr).
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">10. Propriété intellectuelle</h2>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        L&apos;ensemble des éléments constitutifs de la Plateforme — notamment la marque « Ask Service », les logos, la charte graphique, les textes, les interfaces, les algorithmes de scoring et de tarification dynamique, ainsi que toute autre création originale — sont protégés par le droit de la propriété intellectuelle.
                    </p>
                    <p className="text-sm text-darkSilver/90">
                        Toute reproduction, représentation, modification, adaptation, traduction ou exploitation, totale ou partielle, par quelque procédé que ce soit, sans l&apos;autorisation préalable et écrite d&apos;ASK SERVICE SAS, est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">11. Suspension et résiliation</h2>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Ask Service se réserve le droit de suspendre ou de résilier l&apos;accès d&apos;un utilisateur à la Plateforme, avec effet immédiat et sans préavis, dans les cas suivants :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>violation des présentes CGU ou des Conditions Générales de Vente ;</li>
                        <li>fourniture d&apos;informations fausses ou frauduleuses lors de l&apos;inscription ou lors de l&apos;utilisation du service ;</li>
                        <li>comportement abusif, frauduleux ou nuisible à l&apos;égard d&apos;autres utilisateurs ou de la Plateforme ;</li>
                        <li>non-renouvellement ou perte de validité des documents et agréments requis (Prestataires) ;</li>
                        <li>décision judiciaire ou administrative l&apos;imposant.</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">
                        En cas de résiliation pour manquement, les crédits restants sur le compte du Prestataire ne feront l&apos;objet d&apos;aucun remboursement, sauf décision contraire d&apos;Ask-Service.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">12. Droit applicable et juridiction compétente</h2>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation, leur exécution ou leur validité relèvera de la compétence exclusive des juridictions françaises compétentes.
                    </p>
                    <p className="text-sm text-darkSilver/90 mb-3">
                        En cas de litige, les parties s&apos;engagent à rechercher une solution amiable dans un délai de trente (30) jours avant de saisir la juridiction compétente. À défaut d&apos;accord, le litige sera porté devant le Tribunal de Commerce de Bobigny.
                    </p>
                    <p className="text-sm text-darkSilver/90">
                        Médiation : conformément à l&apos;article L. 612-1 du Code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d&apos;un litige.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">13. Mentions légales</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-2">Éditeur de la Plateforme</h3>
                    <ul className="text-sm text-darkSilver/90 list-none space-y-1 mb-4">
                        <li><strong className="text-fontBlack">Raison sociale :</strong> ASK SERVICE SAS</li>
                        <li><strong className="text-fontBlack">Forme juridique :</strong> Société par Actions Simplifiée (SAS)</li>
                        <li><strong className="text-fontBlack">Capital social :</strong> 500,00 €</li>
                        <li><strong className="text-fontBlack">Siège social :</strong> 10-12 Avenue Parmentier, 93420 Villepinte, France</li>
                        <li><strong className="text-fontBlack">RCS :</strong> Registre du Commerce et des Sociétés de Bobigny</li>
                        <li><strong className="text-fontBlack">Numéro RCS :</strong> À compléter lors de l&apos;immatriculation</li>
                        <li><strong className="text-fontBlack">Numéro TVA intracommunautaire :</strong> À compléter lors de l&apos;immatriculation</li>
                        <li><strong className="text-fontBlack">Directeur de la publication :</strong> KEITA Cheïck</li>
                        <li><strong className="text-fontBlack">Contact :</strong> contact@askservice.fr</li>
                        <li><strong className="text-fontBlack">Site web :</strong> https://askservice.fr</li>
                    </ul>
                    <h3 className="text-base font-medium text-fontBlack mb-2">Hébergement</h3>
                    <ul className="text-sm text-darkSilver/90 list-none space-y-1 mb-4">
                        <li><strong className="text-fontBlack">Hébergeur principal (VPS) :</strong> OVH SAS — 2 rue Kellermann, 59100 Roubaix, France</li>
                        <li><strong className="text-fontBlack">CDN & DNS :</strong> Cloudflare Inc. — 101 Townsend St, San Francisco, CA 94107, USA</li>
                        <li><strong className="text-fontBlack">Stockage fichiers :</strong> Cloudflare R2 (compatible S3) — Cloudflare Inc.</li>
                    </ul>
                    {/* <p className="text-sm text-darkSilver/90">
                        Ask-Service · CGU & Mentions légales v1.0 · Août 2026
                    </p> */}
                </div>
            </section>
        </div>
    )
}
