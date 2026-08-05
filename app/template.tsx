/**
 * Re-mounts on every navigation, so each route settles in instead of
 * snapping. Deliberately a CSS animation, not framer: a JS-driven
 * fade would ship `opacity: 0` in the server HTML and leave the whole
 * page invisible if scripts fail. Kept short so it never delays the
 * hero choreography on the landing page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
