export var attackPatterns = {
  "Email Collection": [
    { Mitigation: "Audit", Link: "https://attack.mitre.org/mitigations/M1047" },
    {
      Mitigation: "Encrypt Sensitive Information",
      Link: "https://attack.mitre.org/mitigations/M1041",
    },
    {
      Mitigation: "Multi-factor Authentication",
      Link: "https://attack.mitre.org/mitigations/M1032",
    },
  ],
  "Phishing": [
    {
      Mitigation: "Antivirus/Antimalware",
      Link: "https://attack.mitre.org/mitigations/M1049",
    },
    {
      Mitigation: "Network Intrusion Prevention",
      Link: "https://attack.mitre.org/mitigations/M1031",
    },
    {
      Mitigation: "Restrict Web-Based Content",
      Link: "https://attack.mitre.org/mitigations/M1021",
    },
    {
      Mitigation: "Software Configuration",
      Link: "https://attack.mitre.org/mitigations/M1054",
    },
    {
      Mitigation: "User Training",
      Link: "https://attack.mitre.org/mitigations/M1017",
    },
  ],
  "Defacement": [
    {
      Mitigation: "Data Backup",
      Link: "https://attack.mitre.org/mitigations/M1053/",
    },
  ],
  "Brute Force Access": [
    {
      Mitigation: "Account Use Policies",
      Link: "https://attack.mitre.org/mitigations/M1036",
    },
    {
      Mitigation: "Multi-factor Authentication",
      Link: "https://attack.mitre.org/mitigations/M1032",
    },
    {
      Mitigation: "Password Policies",
      Link: "https://attack.mitre.org/mitigations/M1027/",
    },
    {
      Mitigation: "User Account Management",
      Link: "https://attack.mitre.org/mitigations/M1018",
    },
  ],
  "Disk Wipe": [
    {
      Mitigation: "Data Backup",
      Link: "https://attack.mitre.org/mitigations/M1053",
    },
  ],
  "Password Stores": [
    {
      Mitigation: "Password Policies",
      Link: "https://attack.mitre.org/mitigations/M1027",
    },
  ],
  "Rootkit": [
    {
      Mitigation: "Firmware",
      Link: "https://attack.mitre.org/techniques/T1014/",
    },
  ],
  "SQL injection": [
    {
      Mitigation: "Application Isolation and Sandboxing",
      Link: "https://attack.mitre.org/mitigations/M1048/",
    },
    {
      Mitigation: "Exploit Protection",
      Link: "https://attack.mitre.org/mitigations/M1050/",
    },
    {
      Mitigation: "Network Segmentation",
      Link: "https://attack.mitre.org/mitigations/M1030/",
    },
    {
      Mitigation: "Privileged Account Management",
      Link: "https://attack.mitre.org/mitigations/M1026/",
    },
    {
      Mitigation: "Update Software",
      Link: "https://attack.mitre.org/mitigations/M1051/",
    },
    {
      Mitigation: "Vulnerability Scanning",
      Link: "https://attack.mitre.org/mitigations/M1016/",
    },
  ],
  "DoS": [
    {
      Mitigation: "Filter Network Traffic",
      Link: "https://attack.mitre.org/mitigations/M1037/",
    },
  ],
  "Denial-of-Service": [
    {
      Mitigation: "Filter Network Traffic",
      Link: "https://attack.mitre.org/mitigations/M1037/",
    },
  ],
  "Deadlock": [
    {
      Mitigation: "Use Known Algorithms to Avoid Deadlock Condition",
      Link: "https://capec.mitre.org/data/definitions/25.html",
    },
  ],
  "Network Sniffing": [
    {
      Mitigation: "Encrypt Sensitive Information",
      Link: "https://attack.mitre.org/mitigations/M1041",
    },
    {
      Mitigation: "Multi-factor Authentication",
      Link: "https://attack.mitre.org/mitigations/M1032",
    },
  ],
  "Man-In-The-Middle": [
    {
      Mitigation: "Disable or Remove Feature or Program",
      Link: "https://attack.mitre.org/mitigations/M1042/",
    },
    {
      Mitigation: "Encrypt Sensitive Information",
      Link: "https://attack.mitre.org/mitigations/M1041/",
    },
    {
      Mitigation: "Filter Network Traffic",
      Link: "https://attack.mitre.org/mitigations/M1037/",
    },
    {
      Mitigation: "Limit Access to Resource Over Network",
      Link: "https://attack.mitre.org/mitigations/M1035/",
    },
    {
      Mitigation: "Network Intrusion Prevention",
      Link: "https://attack.mitre.org/mitigations/M1031/",
    },
    {
      Mitigation: "Network Segmentation",
      Link: "https://attack.mitre.org/mitigations/M1030/",
    },
    {
      Mitigation: "User Training",
      Link: "https://attack.mitre.org/mitigations/M1017/",
    },
  ],
  "Masquerading": [
    {
      Mitigation: "Code Signing",
      Link: "https://attack.mitre.org/mitigations/M1045/",
    },
    {
      Mitigation: "Execution Prevention",
      Link: "https://attack.mitre.org/mitigations/M1038/",
    },
    {
      Mitigation: "Restrict File and Directory Permissions",
      Link: "https://attack.mitre.org/mitigations/M1022/",
    },
  ],
  "Drive-by Compromise": [
    {
      Mitigation: "Application Isolation and Sandboxing",
      Link: "https://attack.mitre.org/mitigations/M1048",
    },
    {
      Mitigation: "Exploit Protection",
      Link: "https://attack.mitre.org/mitigations/M1050",
    },
    {
      Mitigation: "Restrict Web-Based Content",
      Link: "https://attack.mitre.org/mitigations/M1021",
    },
    {
      Mitigation: "Update Software",
      Link: "https://attack.mitre.org/mitigations/M1051",
    },
  ],
  "Remote Services": [
    {
      Mitigation: "Disable or Remove Feature or Program",
      Link: "https://attack.mitre.org/mitigations/M1042/",
    },
    {
      Mitigation: "Limit Access to Resource Over Network",
      Link: "https://attack.mitre.org/mitigations/M1035/",
    },
    {
      Mitigation: "Multi-factor Authentication",
      Link: "https://attack.mitre.org/mitigations/M1032/",
    },
    {
      Mitigation: "Network Segmentation",
      Link: "https://attack.mitre.org/mitigations/M1030/",
    },
  ],
  "XSL Script": [
    {
      Mitigation: "Execution Prevention",
      Link: "https://attack.mitre.org/mitigations/M1038",
    },
  ],
  "Replication Through Removable Media": [
    {
      Mitigation: "Behaviour Prevention on Endpoint",
      Link: "https://attack.mitre.org/mitigations/M1040",
    },
    {
      Mitigation: "Disable or Remove Feature or Program",
      Link: "https://attack.mitre.org/mitigations/M1042"
    },
    {
      Mitigation: "Limit Hardware Installation",
      Link: "https://attack.mitre.org/mitigations/M1034"
    }
  ],
  "Hardware Additions": [
    {
      Mitigation: "Limit Access to Resource Over Network",
      Link: "https://attack.mitre.org/mitigations/M1035"
    },
    {
      Mitigation: "Limit Hardware Installation",
      Link: "https://attack.mitre.org/mitigations/M1034"
    }
  ]
};
