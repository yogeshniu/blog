+++
title = "Flow Duration Curve Analyser"
description = "Paste daily river flows to get the flow duration curve, Q-values, a design flow and a simple energy estimate."
layout = "tool"
tool = "fdc"
scripts = ["tools/fdclib", "tools/hydroui"]
weight = 49
group = "Engineering"
icon = "📊"
hideMeta = true
ShowToc = false
comments = false
+++

Uses the Weibull plotting position, P = m / (n + 1). Your data is processed in the browser and is not uploaded anywhere.

The energy estimate is deliberately simple: it assumes constant net head and efficiency and no outages. Use it to compare design flows, and use a full simulation for a feasibility study.
