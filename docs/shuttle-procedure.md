---
title: Product guidelines
tags: docs
---

# Considerations during Shuttle Procedure

This article defines a list of steps to follow during the [Shuttle Procedure](http://atenea.marfeel.com/display/PRODUCT/How+to+shuttle+Gutenberg) in order to **prevent** and **minimize** the impact on clients.

:::warning 
At this point, it is assumed that you understand Alarms System and Anomalies Dashboards. If not please redirect to [Marfeel Reliability](http://atenea.marfeel.com/display/PRODUCT/Marfeel+Reliability)
::: 

## Before Starting

* Don’t add new alarms to the system due to your changes if you’re not going to take the **accountability** of the new alarms. Otherwise, other teams will be impacted without previous knowledge

* Be responsible for all the commits in the Shuttle. Theoretically in Marfeel **one deploy = one commit**. If your shuttle includes some code that someone left in master, take accountability of it. This means:
 * Understand what’s going to be shuttle.
 * Revert if it is necessary.


## Process

### Step 1 - Before deploy, check Anomalies Dashboard metrics are stable
* We have examples in the past where new bugs were included in clients that were already complaining about current bugs
* If the dashboard is **not stable**, please communicate (TBD)

### Step 2 - Deploy in BLG - Monitor Dashboard - Deploy in PRO
* If we detect the problem at BLG, the most important clients that usually are in PRO are not impacted
* Check that metrics (not alarms) in Anomalies Dashboards are stable
 * If so, deploy in **PRO**

### Step 3 - Main tasks if anything goes wrong
* **Revert** : Please **don’t fix the issue and deploy**, takes longer and the impact is higher.
 * Revert in Jenkins and then do the fix in Github
* **Communicate** : Is KEY that Support teams are aware before clients about incidences.
 * Send a summarised email to [pem@marfeel.com](mailto:pem@marfeel.com) using the template below explaining the problem.
 * Do not wait until everything is working to send it

**Template of the email (with examples):**

**Epic**: Test Gemini on tenants with their own Prebid.

**[Build|Upgrade|Change|Cause]:** Technical details are not necessary
* XP build 1234
* GTB build 3424
* MG MContigo build 3324
* Upgrade MongoDB version

**Effect**: (CS should understand it and it should explain how the client will perceive this error )

* adServer not being loaded properly
* Home not refreshing content
* No ads in mosaic
* redirect to the client version

**Impact**:

* Tenant: [lakersnation.com](http://lakersnation.com/) 
* All AMP traffic
* All BLG tenants

### Step 4 - Perform Triage
* Review new alarms next 30-60 mins after your deploy
* New alarms can be identified in the central dashboard as:
 * Priority: Undefined
 * Team: Undefined

### Step 5 - Move Alarm to ‘In Progress’ once you start investigating it

This way is clear for everyone that someone is working on it

### Step 6 - Change issue priority if necessary

Especially with **critical issues**
* If after investigating the issue is clear for you that there’s no impact, change the priority accordingly

# Step 7 - Close the Alarm ASAP

Especially with **critical issues** because if not we’re blind.

Once the fix is done, if errors are stable, close the issue (Evaluate is NOT an Option). If not, in case a new problem arises we may not realize.
