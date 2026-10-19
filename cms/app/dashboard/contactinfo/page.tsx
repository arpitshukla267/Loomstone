"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Phone, Share2, Clock } from "lucide-react";
import { contactApi, type ContactInfo } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

const EMPTY: ContactInfo = {
  email: "",
  phone: "",
  address: "",
  instagram: "",
  facebook: "",
  x: "",
  responseTime: "",
  responseNote: "",
  workshopLocation: "",
  workshopNote: "",
};

const KEYS = Object.keys(EMPTY) as (keyof ContactInfo)[];
const isHttpUrl = (v: string) => /^https?:\/\/\S+$/i.test(v);

export default function ContactInfoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ContactInfo>(EMPTY);
  const [initial, setInitial] = useState<ContactInfo>(EMPTY);

  useEffect(() => {
    contactApi
      .get()
      .then((data) => {
        if (data && data._id) {
          const next = { ...EMPTY } as ContactInfo;
          KEYS.forEach((k) => {
            next[k] = typeof data[k] === "string" ? (data[k] as string) : "";
          });
          setForm(next);
          setInitial(next);
        }
      })
      .catch((e) => toast.error(e.message || "Failed to load contact info"))
      .finally(() => setLoading(false));
  }, []);

  function setField(key: keyof ContactInfo, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  async function save() {
    const email = form.email.trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    for (const k of ["instagram", "facebook", "x"] as const) {
      const v = form[k].trim();
      if (v && !isHttpUrl(v)) {
        toast.error(`${k} link must start with http:// or https://`);
        return;
      }
    }

    setSaving(true);
    try {
      const saved = await contactApi.update(form);
      const next = { ...form } as ContactInfo;
      KEYS.forEach((k) => {
        if (typeof saved?.[k] === "string") next[k] = saved[k];
      });
      setForm(next);
      setInitial(next);
      toast.success("Contact info saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Info"
        description="Details shown in the website footer and on the Contact page. Empty fields are hidden on the site."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              disabled={!dirty || saving}
              onClick={() => setForm(initial)}
            >
              Reset
            </Button>
            <Button
              onClick={save}
              loading={saving}
              disabled={!dirty}
              size="lg"
              className="px-6 shadow-md shadow-[#00355F]/20"
            >
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Card 1: Contact Channels */}
        <Card>
          <CardHeader className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-sm">
              Contact Channels
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="office@loomstone.in"
              />
              <Input
                label="Phone / WhatsApp"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+91 9916199988"
                hint="Include the country code. Call and WhatsApp links are built from this."
              />
              <div className="md:col-span-2">
                <Input
                  label="Address (footer)"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Gurgaon, India"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 2: Social Links */}
        <Card>
          <CardHeader className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-sm">Social Links</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Instagram URL"
                value={form.instagram}
                onChange={(e) => setField("instagram", e.target.value)}
                placeholder="https://instagram.com/yourpage"
              />
              <Input
                label="Facebook URL"
                value={form.facebook}
                onChange={(e) => setField("facebook", e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
              <Input
                label="X (Twitter) URL"
                value={form.x}
                onChange={(e) => setField("x", e.target.value)}
                placeholder="https://x.com/yourhandle"
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Leave a link empty to hide that icon from the footer.
            </p>
          </CardBody>
        </Card>

        {/* Card 3: Contact Page Highlights */}
        <Card>
          <CardHeader className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-sm">
              Contact Page Highlights
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Quick Response"
                value={form.responseTime}
                onChange={(e) => setField("responseTime", e.target.value)}
                placeholder="Within 12 hours"
              />
              <Input
                label="Quick Response Note"
                value={form.responseNote}
                onChange={(e) => setField("responseNote", e.target.value)}
                placeholder="Showroom visits by appointment"
              />
              <Input
                label="Workshop Location"
                value={form.workshopLocation}
                onChange={(e) => setField("workshopLocation", e.target.value)}
                placeholder="Jaipur, India"
              />
              <Input
                label="Workshop Note"
                value={form.workshopNote}
                onChange={(e) => setField("workshopNote", e.target.value)}
                placeholder="Amber Road Craft Enclave"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
