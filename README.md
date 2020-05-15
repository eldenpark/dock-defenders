# Dock Defenders
Micro-UAV defense system for aircraft carriers in foreign ports in peacetime.

This project is initiated for CSCI 599 - Special Topics (Hacking for Defense) in spring 2020 at the University of Southern California.

- Github repo: [https://github.com/eldeni/dock-defenders](https://github.com/eldeni/dock-defenders)
- Demo: [https://eldeni.github.io/dock-defenders](https://eldeni.github.io/dock-defenders)

![Demo](/dock-defenders/assets/demo-1.gif)

## Problem prompt
US Navy ship security teams in ports need to learn how an enemy might place an object on a ship using Micro Unmanned Aerial Systems (mUAS) in order to fortify vessel defenses in port.

## Problem analysis and motivation
Currently micro UAV(uavs from 50cm diameter and smaller) pose a risk to US Navy ships specifically in port. The dangers they pose are explosive, biological, or spying in nature. We investigated the possible ways to mitigate the risk and split the solutions into two categories. The first category (which we focus on) is identification/tracking, and the second category is destroying or capturing the drone. The best way we have found to identify/track these micro UAVs is by combining multiple different sensors together and using an algorithm to decide if a drone is present.

Understandably, the baseline for a system that would protect and inform Navy crews is one of comprehensiveness and reliability. Our general strategy for addressing these broad and apparent needs converged on first identifying the needs and worries of Navy members themselves. In talks with sailors on active duty, defense system engineers of the DoD, scientists of NSWC Crane, and more, it was the general consensus that Navy ships are wholly unprepared for the unique threat vector of microUAVs. It also became clear that there were two distinct classes of drone threats: fully autonomous, and remotely operated. Fully autonomous microUAVs would be deployed uniquely by wealthier adversaries, with the means to fund the necessary research and hardware. These drones would have negligible electromagnetic footprint, and operate with localized navigation such as computer vision. On the other hand, remotely operated microUAVs are inexpensive, commercially available, and would likely be operated by smaller, non-state parties. Both yield significant payload capacity, given their size, and could be integral sources of hard point damage during a pinpoint attack.

## Methodologies
**Ensemble Model Approach**

Since audio and video are information rich as well as accessible, we decided to do sensor fusion using these two different types of data. Our ensemble model, in our lab-isolated environment, were found to be yielding a decent quality of detecting performance.

**Synthetic Data**

Due to inherent difficulty of collecting the data on site, especially in the times of a disease outbreak, we managed to create a synthetic dataset to train the models by aggregating video and sound clips. For instance, we have merged a video of drone flying over the grassland and that of a shipyard. The synthetic media was then fed into our models for each optical and acoustic analysis.

Below we provide two different videos we tried to merge into one as an example.
- [Drone flying over grassland](https://www.youtube.com/watch?v=y2upGBMHhuw)
- [Shipyard](https://youtu.be/ys6NzFWK4oU)


## Documentation
**[Final Report](https://docs.google.com/document/d/1O2uDoGs6mDqzvAIVoGMtDXby9XzD4Tt07XqDDN8YOTw/edit?usp=sharing)**

**[Presentation](https://docs.google.com/presentation/d/1EcVRZDlwae2sgNdfm3ys6yM--ynLRUX6-OPq5U-G2LU/edit?usp=sharing)**

## Contributors
- Patrick Darrow [https://www.linkedin.com/in/patrickjdarrow/](https://www.linkedin.com/in/patrickjdarrow/)
- Sophia Mallaro [https://www.linkedin.com/in/sophia-mallaro-148a18a4/](https://www.linkedin.com/in/sophia-mallaro-148a18a4/)
- Elden Park [https://www.linkedin.com/in/eldenpark](https://www.linkedin.com/in/eldenpark)
- Ryan Winters [https://www.linkedin.com/in/ryan-winters-296631b0/](https://www.linkedin.com/in/ryan-winters-296631b0/)
