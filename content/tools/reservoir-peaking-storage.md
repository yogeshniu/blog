+++
title = "Reservoir Peaking Storage"
description = "Usable reservoir volume between two levels from an area-elevation table, and how many hours of peaking it supports."
layout = "tool"
tool = "reservoir"
scripts = ["tools/hydrolib", "tools/hydroui"]
weight = 47
group = "Engineering"
icon = "📈"
hideMeta = true
ShowToc = false
comments = false
+++

Trapezoidal integration of the area-elevation table, counting only the slices between the lowest and highest regulating levels. Peaking storage = (Qpeak − Qmin) × hours × 3600.

The starting values are an illustrative example. A red check on them only means that example is marginal at that point; it is not an error in the tool.
