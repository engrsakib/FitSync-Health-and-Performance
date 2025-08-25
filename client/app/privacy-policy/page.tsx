"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, UserCheck, Database, Globe } from "lucide-react"

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information you provide when creating an account (name, email, profile picture)",
        "Fitness data including workout history, progress tracking, and health metrics",
        "Usage data such as app interactions, feature usage, and session duration",
        "Device information including IP address, browser type, and operating system",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Provide personalized workout recommendations and fitness plans",
        "Track your progress and help you achieve your fitness goals",
        "Communicate with you about your account, updates, and new features",
        "Improve our services through analytics and user feedback",
        "Ensure platform security and prevent fraudulent activities",
      ],
    },
    {
      icon: Lock,
      title: "Data Protection",
      content: [
        "All data is encrypted in transit and at rest using industry-standard protocols",
        "We implement multi-factor authentication and regular security audits",
        "Access to your data is restricted to authorized personnel only",
        "Regular backups ensure data availability and disaster recovery",
        "We comply with GDPR, CCPA, and other applicable privacy regulations",
      ],
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access and download your personal data at any time",
        "Request correction of inaccurate or incomplete information",
        "Delete your account and associated data permanently",
        "Opt-out of marketing communications and data processing",
        "Port your data to another service provider upon request",
      ],
    },
    {
      icon: Globe,
      title: "Data Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Data may be shared with certified trainers for personalized coaching",
        "Anonymous, aggregated data may be used for research and improvement",
        "We may share data when required by law or to protect user safety",
        "Third-party integrations only receive necessary data with your consent",
      ],
    },
    {
      icon: Shield,
      title: "Data Retention",
      content: [
        "Account data is retained while your account is active",
        "Workout and progress data is kept for historical tracking purposes",
        "Deleted accounts are permanently removed within 30 days",
        "Backup data is securely deleted according to our retention schedule",
        "Legal compliance may require longer retention in specific cases",
      ],
    },
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">
            Privacy Policy
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Your Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Matters</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            At FitSync, we are committed to protecting your privacy and ensuring the security of your personal
            information. This policy explains how we collect, use, and safeguard your data.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">Last updated: January 1, 2024</div>
        </motion.div>

        {/* Privacy Sections */}
        <div className="grid gap-8 max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Questions About Privacy?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or how we handle your data, please don't hesitate to
                contact us.
              </p>
              <div className="space-y-2">
                <p className="font-medium">Email: privacy@fitsync.dev</p>
                <p className="font-medium">Phone: ০১৯১১১১১১১১</p>
                <p className="font-medium">Address: স্টেডিয়ামপাড়া, মাগুরা সদর, মাগুরা, বাংলাদেশ</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
