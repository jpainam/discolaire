import Link from "next/link";

import { LogoLarge } from "~/components/logo-large";
import { SubscribeInput } from "~/components/subscribe-input";
import { GithubStars } from "./github-stars";
import { SocialLinks } from "./social-links";
import { StatusWidget } from "./status-widget";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t-[1px] border-border bg-[#0C0C0C] px-4 pt-10 md:max-h-[820px] md:px-6 md:pt-16">
      <div className="container">
        <div className="mb-12 flex items-center justify-between border-b-[1px] border-border pb-10 md:pb-16">
          <Link href="/" className="-ml-[52px] scale-50 md:ml-0 md:scale-100">
            <LogoLarge />
            <span className="sr-only">Midday</span>
          </Link>

          <span className="text-right font-normal md:text-2xl">
            Run your business smarter.
          </span>
        </div>

        <div className="flex w-full flex-col md:flex-row">
          <div className="flex flex-col justify-between space-y-8 leading-8 md:w-6/12 md:flex-row md:space-y-0">
            <div>
              <span className="font-medium">Features</span>
              <ul>
                <li className="text-[#878787] transition-colors">
                  <Link href="/overview">Overview</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/inbox">Inbox</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/vault">Vault</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/tracker">Tracker</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/invoice">Invoice</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/engine">Engine</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/download">Download</Link>
                </li>
              </ul>
            </div>

            <div>
              <span>Resources</span>
              <ul>
                <li className="text-[#878787] transition-colors">
                  <Link href="https://git.new/midday">Github</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/support">Support</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/policy">Privacy policy</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/terms">Terms and Conditions</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/branding">Branding</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/feature-request">Feature Request</Link>
                </li>
              </ul>
            </div>

            <div>
              <span>Company</span>
              <ul>
                <li className="text-[#878787] transition-colors">
                  <Link href="/story">Story</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/updates">Updates</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/open-startup">Open startup</Link>
                </li>
                <li className="text-[#878787] transition-colors">
                  <Link href="/oss-friends">OSS friends</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex md:mt-0 md:w-6/12 md:justify-end">
            <div className="flex flex-col md:items-end">
              <div className="mb-8 flex flex-col items-start space-y-6 md:flex-row md:items-center md:space-y-0">
                <GithubStars />
                <SocialLinks />
              </div>

              <div className="mb-8">
                <SubscribeInput group="news" />
              </div>
              <div className="mr-auto mt-auto md:mr-0">
                <StatusWidget />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="pointer-events-none text-center text-[500px] leading-none text-[#161616]">
        midday
      </h5>
    </footer>
  );
}
