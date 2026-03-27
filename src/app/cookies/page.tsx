import React from 'react'

export default function CookiesPage() {
    return (
        <div className="min-h-screen body_x_axis_padding container_y_padding_lg w-full max-w-2xl md:max-w-none md:w-2/3 mx-auto space-y-10">
            <section className="w-full">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-fontBlack mb-2 md:mb-4">
                    Politique cookies & bandeau de consentement
                </h1>
                <p className="text-sm md:text-base text-darkSilver/90">
                    La présente politique cookies a pour objectif d'informer les utilisateurs de la plateforme Ask Service sur l'utilisation des cookies et autres traceurs, conformément au RGPD et aux recommandations de la CNIL. Pour en savoir plus, consultez notre Politique de confidentialité et notre Avis sur les cookies.
                </p>
            </section>
            <section className="w-full space-y-6 prose prose-sm max-w-none text-fontBlack">
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">1. Qu'est-ce qu'un cookie ?</h2>
                    <p className="text-sm text-darkSilver/90">
                        Un cookie est un petit fichier texte déposé sur le terminal de l'utilisateur (ordinateur, mobile, tablette) lors de la consultation d'un site internet. Il permet de collecter des informations relatives à la navigation.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">2. Types de cookies utilisés</h2>
                    <h3 className="text-base font-medium text-fontBlack mb-1">2.1 Cookies strictement nécessaires (obligatoires)</h3>
                    <p className="text-sm text-darkSilver/90 mb-2">
                        Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-2">
                        <li>Gestion de session utilisateur</li>
                        <li>Sécurité et prévention des fraudes</li>
                        <li>Accès aux espaces sécurisés</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90 mb-4">Aucun consentement requis.</p>

                    <h3 className="text-base font-medium text-fontBlack mb-1">2.2 Cookies de mesure d'audience (statistiques)</h3>
                    <p className="text-sm text-darkSilver/90 mb-2">
                        Ces cookies permettent de comprendre comment les utilisateurs interagissent avec la plateforme.
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-2">
                        <li>Pages consultées</li>
                        <li>Temps passé sur le site</li>
                        <li>Sources de trafic</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90 mb-4">Soumis au consentement préalable.</p>

                    <h3 className="text-base font-medium text-fontBlack mb-1">2.3 Cookies marketing et publicitaires</h3>
                    <p className="text-sm text-darkSilver/90 mb-2">
                        Ces cookies sont utilisés pour proposer des publicités ciblées et mesurer l'efficacité des campagnes.
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-2">
                        <li>Google Ads</li>
                        <li>Facebook Pixel</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">Soumis au consentement préalable.</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">3. Gestion du consentement</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">
                        Lors de la première visite, un bandeau cookies s'affiche permettant à l'utilisateur de :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-2">
                        <li>Accepter tous les cookies</li>
                        <li>Refuser tous les cookies non essentiels</li>
                        <li>Personnaliser ses choix</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">
                        Aucun cookie non essentiel n'est déposé sans consentement explicite.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">4. Durée de conservation des cookies</h2>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li><strong>Cookies nécessaires :</strong> durée de session ou maximale de 12 mois</li>
                        <li><strong>Cookies statistiques :</strong> 13 mois maximum</li>
                        <li><strong>Cookies marketing :</strong> 13 mois maximum</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">5. Paramétrage et retrait du consentement</h2>
                    <p className="text-sm text-darkSilver/90">
                        L'utilisateur peut modifier ses préférences à tout moment via un lien « Gestion des cookies » accessible en bas de page ou via les paramètres de son navigateur.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">6. Bandeau de consentement – exigences CNIL</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">Le bandeau doit :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-3">
                        <li>Être visible dès l'arrivée sur le site</li>
                        <li>Présenter clairement les finalités</li>
                        <li>Proposer un bouton « Refuser » au même niveau que « Accepter »</li>
                        <li>Permettre une personnalisation granulaire</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90 mb-1 font-medium">Interdictions :</p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>Cases pré-cochées</li>
                        <li>Consentement implicite</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">7. Preuve du consentement</h2>
                    <p className="text-sm text-darkSilver/90 mb-2">
                        La plateforme conserve une preuve du consentement de l'utilisateur :
                    </p>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1 mb-2">
                        <li>Date</li>
                        <li>Version de la politique</li>
                        <li>Choix effectués</li>
                    </ul>
                    <p className="text-sm text-darkSilver/90">Ces données sont conservées à des fins de conformité.</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">8. Cookies tiers</h2>
                    <p className="text-sm text-darkSilver/90">
                        Des cookies tiers peuvent être déposés par des partenaires (paiement, statistiques).
                        Ask Service s'assure que ces partenaires respectent le RGPD.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">9. Modification de la politique cookies</h2>
                    <p className="text-sm text-darkSilver/90">
                        La présente politique peut être modifiée à tout moment.
                        Toute modification substantielle donnera lieu à une nouvelle demande de consentement.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">10. Contact</h2>
                    <p className="text-sm text-darkSilver/90">
                        Pour toute question relative aux cookies : <strong>contact@askservice.fr</strong>
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-fontBlack mb-2">11. Date de mise à jour</h2>
                    <p className="text-sm text-darkSilver/90">Dernière mise à jour : (à compléter)</p>
                </div>
                <div className="border-t border-darkSilver/20 pt-6">
                    <h2 className="text-lg font-semibold text-fontBlack mb-3">Annexe – Texte du bandeau cookies</h2>
                    <blockquote className="text-sm text-darkSilver/90 italic border-l-4 border-darkSilver/30 pl-4 mb-4">
                        « Ask Service utilise des cookies nécessaires au fonctionnement du site et, avec votre accord, des cookies de mesure d'audience et de marketing afin d'améliorer votre expérience. Vous pouvez accepter, refuser ou personnaliser vos choix à tout moment. »
                    </blockquote>
                    <ul className="text-sm text-darkSilver/90 list-disc list-inside space-y-1">
                        <li>Accepter tout</li>
                        <li>Refuser tout</li>
                        <li>Personnaliser</li>
                    </ul>
                </div>
            </section>
        </div>
    )
}
