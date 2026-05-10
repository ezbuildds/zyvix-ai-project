import { useState } from "react";
import "../css/Tool.css"
import { memo } from "react";
import { IconDoc, IconEraser, IconHash, IconImage, IconPen, IconScissors } from "../Icons/svgIcon";
import { tools } from "../Data/tools";

const iconComponents = [IconPen, IconHash, IconImage, IconEraser, IconScissors, IconDoc];

function ToolsSection() {
  const [hovered, setHovered] = useState(null);
  return (
    <>
      <section className="tools-section">
        <div className="tools-header">
          <h2>Powerful AI Tools</h2>
          <p>Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.</p>
        </div>

        <div className="tools-grid">
          {tools.map((tool, i) => {
            const Icon = iconComponents[i];
            return (
              <div
                key={i}
                className="tool-card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={`icon-wrap ${tool.iconClass}`}>
                  <Icon />
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                <div className="card-arrow">→</div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
export default memo(ToolsSection)