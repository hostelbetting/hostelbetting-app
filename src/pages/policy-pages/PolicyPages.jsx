import React, { useContext, useEffect } from 'react'
import TabNameContext from '../../contexts/TabName.context';

export const TermsAndConditions = () => {
    // Set tabtitle 
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("Terms");
        document.title = "Hostelbetting.fun - Terms & Conditions"
    }, [])
    return (
        <div className='container'>
            <p>Welcome to HostelBetting.fun! By accessing or using our platform, you agree to comply with the following
                terms and conditions. Please read them carefully before participating in any activities on this website.
            </p>
            <div class="mb-4">
                <h6 class="mb-3">Eligibility</h6>
                <ul class="mb-0">
                    <li>You must be at least 18 years old or meet the minimum age requirement of your jurisdiction to
                        participate in activities involving real money.
                    </li>
                    <li>By using this website, you confirm that participating in betting activities is legal in your region.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Account Registration</h6>
                <ul class="mb-0">
                    <li>Each user must register an account to participate.</li>
                    <li>You are responsible for maintaining the confidentiality of your account credentials. Any activity conducted through your account will be your responsibility.</li>
                    <li>Duplicate accounts are not allowed. Each user may have only one account.</li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Betting System</h6>
                <ul class="mb-0">
                    <li>Dummy Coins: Dummy coins are a virtual currency with no real monetary value. They are for
                        entertainment purposes only.
                    </li>
                    <li>Real Money Bets: When betting with real money, you acknowledge and accept the associated risks.
                    </li>
                    <li>A winning bet returns 1.5 times the original amount staked.
                    </li>
                    <li>Bets cannot be modified or canceled once placed.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Prohibited Activities</h6>
                <ul class="mb-0">
                    <li>Using the website for fraudulent purposes or exploiting technical vulnerabilities.
                    </li>
                    <li>Placing bets on matches in which you are directly involved.
                    </li>
                    <li>Sharing or trading accounts with other users.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Payment and Withdrawals</h6>
                <ul class="mb-0">
                    <li>Deposits for real-money betting can only be made through supported payment methods.
                    </li>
                    <li>Winnings can be withdrawn to the registered payment method, subject to verification of identity.
                    </li>
                    <li>HostelBetting.fun reserves the right to withhold payments in cases of suspected fraud or rule
                        violations.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Risk Acknowledgement</h6>
                <ul class="mb-0">
                    <li>Betting involves financial risk, and you may lose your stake.
                    </li>
                    <li>HostelBetting.fun does not provide guarantees or assurances regarding the outcome of any bets or
                        matches.
                    </li>
                    <li>Users are encouraged to bet responsibly.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Fair Play and Match Integrity</h6>
                <ul class="mb-0">
                    <li>All sports matches are expected to be conducted fairly.
                    </li>
                    <li>Match-fixing or influencing outcomes to gain betting advantages is strictly prohibited.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Limitations of Liability</h6>
                <ul class="mb-0">
                    <li>HostelBetting.fun is not responsible for technical issues, such as server outages or connectivity
                        problems.
                    </li>
                    <li>The platform is provided “as is” without warranties of any kind, either express or implied.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Privacy and Data Protection</h6>
                <ul class="mb-0">
                    <li>Your personal information will be handled in accordance with our [Privacy Policy].
                    </li>
                    <li>We do not share your information with third parties except as required by law.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Modification of Terms</h6>
                <ul class="mb-0">
                    <li>HostelBetting.fun reserves the right to modify these terms and conditions at any time.
                    </li>
                    <li>Changes will be effective upon posting to the website. Continued use of the platform constitutes
                        acceptance of the updated terms.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3">Termination of Use</h6>
                <ul class="mb-0">
                    <li>We reserve the right to suspend or terminate any account that violates our terms or engages in
                        prohibited activities.
                    </li>
                    <li>In such cases, any pending balances may be forfeited.
                    </li>
                </ul>
            </div>
            <div class="mb-4">
                <h6 class="mb-3"> Contact Us</h6>
                <p>For any questions or concerns, please contact us at <a
                    href="mailto:support@hostelbetting.fun">support@hostelbetting.fun</a><br />
                    By using HostelBetting.fun, you agree to these Terms and Conditions. If you do not agree, please refrain
                    from using our website.
                </p>
            </div>
        </div>
    )
}

export const PrivacyPolicyPage = () => {
    // Set tabtitle 
    const { tabName, setTabName } = useContext(TabNameContext);
    useEffect(() => {
        setTabName("Privacy policy");
        document.title = "Hostelbetting.fun - Privacy policy"
    }, [])
    return (
        <div className='container'>
            <div className='mb-5'>
                At HostelBetting.fun, your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
            </div>
            <div>
                <h5>1. Information We Collect</h5>
                <p>We collect the following types of information:</p>
                <div className='mb-3'>
                    <h6>a. Personal Information</h6>
                    <ul>
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Contact information</li>
                        <li>Payment details (if applicable)</li>
                    </ul>
                </div>
                <div className='mb-3'>
                    <h6>b. Non-Personal Information</h6>
                    <ul>
                        <li>IP address</li>
                        <li>Browser type</li>
                        <li>Cookies and usage data</li>
                    </ul>
                </div>
            </div>
            <div className='mb-4'>
                <h5>2. How We Use Your Information</h5>
                <p>We use the collected information to:</p>
                <ul>
                    <li>Provide and maintain our services</li>
                    <li>Process transactions</li>
                    <li>Send updates about tournaments, promotions, and events</li>
                    <li>Improve user experience</li>
                    <li>Comply with legal obligations</li>
                </ul>
            </div>
            <div className='mb-4'>
                <h5>3. Sharing of Information</h5>
                <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information with:</p>
                <ul>
                    <li>Payment processors to facilitate transactions</li>
                    <li>Legal authorities when required by law</li>
                    <li>Send updates about tournaments, promotions, and events</li>
                    <li>Service providers to improve our website’s functionality</li>
                </ul>
            </div>
            <div className='mb-4'>
                <h5>4. Cookies</h5>
                <p>We use cookies to enhance your experience. Cookies help us understand how you interact with our website and allow us to:</p>
                <ul>
                    <li>Keep you logged in</li>
                    <li>Save preferences</li>
                    <li>Track performance and improve functionality</li>
                </ul>
                <p>You can manage your cookie preferences through your browser settings.</p>
            </div>
            <div className='mb-4'>
                <h5>5. Security Measures</h5>
                <p>We implement industry-standard measures to safeguard your data, including encryption and secure server connections. However, no method of transmission over the internet is 100% secure.</p>
            </div>
            <div className='mb-4'>
                <h5>6. User Responsibilities</h5>
                <p>We use cookies to enhance your experience. Cookies help us understand how you interact with our website and allow us to:</p>
                <ul>
                    <li>Keep you logged in</li>
                    <li>Save preferences</li>
                    <li>Track performance and improve functionality</li>
                </ul>
                <p>You can manage your cookie preferences through your browser settings.</p>
            </div>
            <div className='mb-4'>
                <h5>7. Children’s Privacy</h5>
                <p>Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>
            </div>
            <div className='mb-4'>
                <h5>8. Your Rights</h5>
                <p>You have the right to:</p>
                <ul>
                    <li>Access, update, or delete your personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request a copy of your data</li>
                </ul>
            </div>
            <div className='mb-4'>
                <h5>9. Changes to This Policy</h5>
                <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the effective date will be updated accordingly.</p>
            </div>
            <div className='mb-5'>
                <h5>10. Contact Us</h5>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p>Email: <a href="mailto:support@hostelbetting.fun"></a></p>
            </div>
            <div className='mb-4'>Thank you for trusting HostelBetting.fun. We are committed to ensuring your privacy and security while providing an engaging betting experience.</div>
        </div>
    )
}
